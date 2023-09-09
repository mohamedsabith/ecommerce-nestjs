import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import validationSchema from './validation.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Make the configuration available throughout the entire app
      validationSchema, // Apply validation using the defined schema
      envFilePath: ['.env.development', '.env'], // Specify environment files to load
    }),
  ],
})
export class CustomConfigModule {}
