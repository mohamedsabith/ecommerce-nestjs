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

    const name = exception.getResponse();

    const errorResponse: ErrorResponse = {
      timestamp: new Date().toISOString(),
      path: request.url,
      error: {
        name: status == 500 ? 'Unknown' : name['error'] ? name['error'] : name,
        message: status == 500 ? 'Something Went Wrong' : exception.message,
      },
    };

    const winstonErrorMessage = {
      path: request.url,
      name: status == 500 ? 'Unknown' : name['error'] ? name['error'] : name,
      message: status == 500 ? 'Something Went Wrong' : exception.message,
    };

    winstonLogger.error(winstonErrorMessage);

    response.status(status == 500 ? 400 : status).json(errorResponse);
  }
}
