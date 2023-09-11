import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import {
  API_PREFIX,
  ALLOWED_HEADERS,
  ALLOWED_METHODS,
  ALLOWED_ORIGINS,
  MAX_AGE,
} from './common/constants/constants';
import { rateLimitMiddleware } from './middlewares/rate-limit.middleware';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { InternalExceptionFilter } from './filters/internal-exception.filter';
import { MyLogger } from './utils/logger';
import { swaggerOptions } from './config/swagger/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new MyLogger('Server');

  // -- Cors setup
  app.enableCors({
    origin: ALLOWED_ORIGINS.split(','), // Set this to the origin(s) that you want to allow
    methods: ALLOWED_METHODS,
    allowedHeaders: ALLOWED_HEADERS,
    maxAge: MAX_AGE,
  });

  // -- Helmet
  app.use(helmet());

  app.use(compression());

  // -- Rate limiting: Limits the number of requests from the same IP in a period of time.
  app.use(rateLimitMiddleware);

  app.use(cookieParser());

  //Exception Filter
  app.useGlobalFilters(
    new InternalExceptionFilter(),
    new HttpExceptionFilter(),
  );

  app.use(bodyParser.json({ limit: '30mb' }));
  app.use(
    bodyParser.urlencoded({
      limit: '30mb',
      extended: true,
      parameterLimit: 2000,
    }),
  );

  // base routing
  app.setGlobalPrefix(API_PREFIX);

  // Use Global Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const document = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup('api', app, document);

  const PORT = configService.get<number>('PORT', 3000);

  await app.listen(PORT, () => {
    logger.verbose(`Server started at http://localhost:${PORT}`);
    logger.verbose(`Swagger-ui is available on http://localhost:${PORT}/api`);
  });
}
bootstrap();
