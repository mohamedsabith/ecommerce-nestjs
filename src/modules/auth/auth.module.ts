import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { Otp } from './entities/otp.entity';
import { OtpService } from './service/otp-sender.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Otp])],
  controllers: [AuthController],
  providers: [AuthService, OtpService],
})
export class AuthModule {}
