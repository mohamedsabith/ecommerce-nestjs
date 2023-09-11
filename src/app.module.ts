import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { CustomConfigModule } from './config/config.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    CustomConfigModule,
    TypeOrmModule.forRootAsync({
      useFactory: () => require('./config/typeorm/typeorm.config'), // Reference the TypeORM config file
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
