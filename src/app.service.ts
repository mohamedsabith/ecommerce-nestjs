import { Injectable } from '@nestjs/common';
import { APP_NAME, APP_VERSION } from './common/constants/constants';

@Injectable()
export class AppService {
  getHello(): string {
    return `${APP_NAME} - Version ${APP_VERSION}`;
  }
}
