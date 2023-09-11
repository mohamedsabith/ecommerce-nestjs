import { ConsoleLogger } from '@nestjs/common';
import winstonLogger from 'src/config/winston/winston.logger';

export class MyLogger extends ConsoleLogger {
  error(message: any, stack?: string, context?: string) {
    // add your tailored logic here
    super.error(message, stack, context);

    winstonLogger.error(message);
  }

  warn(message: any, ...optionalParams: any[]) {
    // add your tailored logic here
    super.warn(message, ...optionalParams);

    winstonLogger.info(message);
  }

  log(message: any, ...optionalParams: any[]) {
    // add your tailored logic here
    super.log(message, ...optionalParams);

    winstonLogger.info(message);
  }

  debug(message: any, ...optionalParams: any[]) {
    // add your tailored logic here
    super.debug(message, ...optionalParams);

    winstonLogger.info(message);
  }

  verbose(message: any, ...optionalParams: any[]) {
    // add your tailored logic here
    super.verbose(message, ...optionalParams);

    winstonLogger.info(message);
  }
}
