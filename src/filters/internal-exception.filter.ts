import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import winstonLogger from 'src/config/winston/winston.logger';

export interface ErrorResponse {
  timestamp: string;
  path: string;
  error: {
    name: string;
    message: object | string;
  };
}

@Catch()
export class InternalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest<Request & { id: string }>();

    winstonLogger.error({
      message: exception.message,
    });

    const errorResponse: ErrorResponse = {
      timestamp: new Date().toISOString(),
      path: request.url,
      error: {
        name: 'Exception Error',
        message: exception.message,
      },
    };

    response.status(500).json(errorResponse);
  }
}
