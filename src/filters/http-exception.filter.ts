import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import winstonLogger from 'src/config/winston/winston.logger';

export interface ErrorResponse {
  timestamp: string;
  path: string;
  error: {
    name: string;
    message: object | string;
  };
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let name: string;
    let message: object | string;

    if (status === HttpStatus.BAD_REQUEST) {
      // Handle validation errors
      name = 'Validation Error';
      if (exception.response.message) {
        if (Array.isArray(exception.response.message)) {
          // If multiple validation errors, use them all
          message = exception.response.message;
        } else if (typeof exception.response.message === 'object') {
          // If it's an object, assume it's a validation error object
          message = Object.values(exception.response.message);
        } else {
          // If it's a string, use it as is
          message = exception.response.message;
        }
      } else {
        // Default message for validation errors
        message = 'Validation failed';
      }
    } else {
      // Handle other errors
      const errorName = exception.getResponse();

      if (errorName === 'ThrottlerException: Too Many Requests') {
        name = 'Too Many Requests';
        message = 'Maximum attempts reached. Please go back and try again.';
      } else {
        name = errorName['error'] ? errorName['error'] : errorName;
        message = exception.message || 'Something went wrong';
      }
    }

    const errorResponse: ErrorResponse = {
      timestamp: new Date().toISOString(),
      path: request.url,
      error: {
        name,
        message,
      },
    };

    const winstonErrorMessage = {
      path: request.url,
      name,
      message,
    };

    // Log the error
    winstonLogger.error(winstonErrorMessage);

    // Set the HTTP status code and send the JSON response
    response.status(status).json(errorResponse);
  }
}
