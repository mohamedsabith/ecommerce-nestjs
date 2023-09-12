import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  PhoneNumberDto,
  OTPVerificationDto,
  SignupCredentialsDto,
} from './dto/signup-credentials.dto';

@Controller('auth')
@UseGuards(ThrottlerGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/phone-verification')
  @Throttle({
    default: {
      limit: 5,
      ttl: 60000,
    },
  })
  @ApiOperation({
    summary: 'Request phone number verification',
    description: 'Request to verify a phone number with OTP.',
  })
  verifyPhoneNumber(@Body() phoneNumberDto: PhoneNumberDto) {
    return this.authService.verifyPhoneNumber(phoneNumberDto);
  }

  @Throttle({
    default: {
      limit: 5,
      ttl: 60000,
    },
  })
  @Post('/otp-verify')
  @ApiOperation({
    summary: 'Verify OTP code',
    description: 'Verify the OTP code received on the phone number.',
  })
  OtpVerification(@Body() OtpVerificationDto: OTPVerificationDto) {
    return this.authService.OtpVerification(OtpVerificationDto);
  }
}
