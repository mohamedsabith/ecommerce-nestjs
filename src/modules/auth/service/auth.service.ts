import { Injectable } from '@nestjs/common';
import {
  PhoneNumberDto,
  OTPVerificationDto,
  SignupCredentialsDto,
} from '../dto/signup-credentials.dto';
import { OtpService } from './otp.service';
import { generateOTP } from 'src/utils/otp.util';

@Injectable()
export class AuthService {
  constructor(private otpService: OtpService) {}

  async verifyPhoneNumber(phoneNumberDto: PhoneNumberDto) {
    const otp: number = await generateOTP(6);

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 1);

    this.otpService.createOtp(otp, phoneNumberDto.phoneNumber, expiresAt);

    return this.otpService.sendOTP(
      phoneNumberDto.phoneNumber,
      phoneNumberDto.countryCode,
      otp,
    );
  }

  OtpVerification(otpVerificationDto: OTPVerificationDto) {
    return this.otpService.verifyOtp(
      otpVerificationDto.phoneNumber,
      otpVerificationDto.otp,
    );
  }
}
