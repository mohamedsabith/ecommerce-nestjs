import { DocumentBuilder } from '@nestjs/swagger';
import {
  APP_NAME,
  APP_DESCRIPTION,
  APP_VERSION,
} from 'src/common/constants/constants';

export const swaggerOptions = new DocumentBuilder()
  .setTitle(APP_NAME) // Replace with your API title
  .setDescription(APP_DESCRIPTION) // Replace with your API description
  .setVersion(APP_VERSION) // Replace with your API version
  .setExternalDoc('For more information', 'http://swagger.io')
  .addBearerAuth()
  .addTag(APP_NAME, APP_DESCRIPTION)
  .build();
