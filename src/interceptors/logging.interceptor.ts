import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import winstonLogger from '../config/winston/winston.logger';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  private formatContentLength(contentLength: number): string {
    if (contentLength < 1024) {
      return `${contentLength} bytes`;
    } else if (contentLength < 1024 * 1024) {
      return `${(contentLength / 1024).toFixed(2)} KB`;
    } else if (contentLength < 1024 * 1024 * 1024) {
      return `${(contentLength / (1024 * 1024)).toFixed(2)} MB`;
    } else {
      return `${(contentLength / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    }
  }

  private formatResponseTime(responseTime: number): string {
    if (responseTime < 1000) {
      return `${responseTime}ms`;
    } else if (responseTime < 60000) {
      const seconds = Math.floor(responseTime / 1000);
      const milliseconds = responseTime % 1000;
      return `${seconds}s ${milliseconds}ms`;
    } else {
      const minutes = Math.floor(responseTime / 60000);
      const seconds = Math.floor((responseTime % 60000) / 1000);
      return `${minutes}m ${seconds}s`;
    }
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;
    const now = Date.now();

    return next.handle().pipe(
      tap(async () => {
        const response = context.switchToHttp().getResponse();
        const statusCode = response.statusCode;
        const responseTime = Date.now() - now;
        const contentLength = response.get('content-length') || 0;
        const userIp =
          request.headers['x-forwarded-for'] ||
          request.connection.remoteAddress;
        const userAgent = request.headers['user-agent'];
        const requestBody = request.body;
        const requestParams = request.params;
        const requestQuery = request.query;

        const yellow = '\x1b[33m';
        const blue = '\x1b[34m';
        const green = '\x1b[32;1m';
        const magenta = '\x1b[35m';
        const red = '\x1b[31m';
        const reset = '\x1b[0m';

        const statusCodeColor =
          statusCode >= 100 && statusCode <= 199
            ? blue // Informational responses in blue
            : statusCode >= 200 && statusCode <= 299
            ? green // Successful responses in green
            : statusCode >= 300 && statusCode <= 399
            ? yellow // Redirection messages in yellow
            : statusCode >= 400 && statusCode <= 499
            ? red // Client error responses in red
            : statusCode >= 500 && statusCode <= 599
            ? red // Server error responses in red
            : reset; // Default color for other status codes

        const logMessage = `${yellow}[${method} {${url}}] - ${statusCodeColor}${statusCode} ${magenta}Content-Length: ${this.formatContentLength(
          contentLength,
        )}${reset} ${yellow}+${this.formatResponseTime(responseTime)}${reset}`;

        const winstonLog = {
          method: method,
          url: url,
          statusCode: statusCode,
          contentLength: this.formatContentLength(contentLength),
          responseTime: this.formatResponseTime(responseTime),
          userIp: userIp,
          userAgent: userAgent,
          requestBody: requestBody,
          requestParams: requestParams,
          requestQuery: requestQuery,
        };

        this.logger.debug(logMessage);
        winstonLogger.info(winstonLog);
      }),
    );
  }
}
