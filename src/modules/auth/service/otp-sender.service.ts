import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Otp } from '../entities/otp.entity';
import { Twilio } from 'twilio';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OtpService {
  private twilioClient: Twilio;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Otp)
    private readonly otpRepository: Repository<Otp>,
  ) {
    // Initialize Twilio client using your credentials from the configuration
    const twilioAccountSid =
      this.configService.get<string>('TWILIO_ACCOUNT_SID');
    const twilioAuthToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');
    this.twilioClient = new Twilio(twilioAccountSid, twilioAuthToken);
  }

  async createOtp(
    otpValue: number,
    phoneNumber: number,
    expiresAt: Date,
  ): Promise<Otp> {
    return this.otpRepository.save({ otpValue, phoneNumber, expiresAt });
  }

  async sendOTP(
    phoneNumber: number,
    countryCode: string,
    otp: number,
  ): Promise<string> {
    try {
      const message = await this.twilioClient.messages.create({
        body: `Your OTP is: ${otp}`,
        from: this.configService.get<string>('TWILIO_PHONE_NUMBER'), // Your Twilio phone number
        to: countryCode + phoneNumber, // Recipient's phone number
      });
      return `OTP sent to ${phoneNumber}: ${message.sid}`; // OTP sent successfully
    } catch (error) {
      console.error(`Error sending OTP to ${phoneNumber}: ${error.message}`);
      return `Error sending OTP to ${phoneNumber}: ${error.message}`; // Failed to send OTP
    }
  }

  async getOtp(phoneNumber: number): Promise<Otp | undefined> {
    return this.otpRepository
      .createQueryBuilder('otp')
      .where('otp.phoneNumber = :phoneNumber', { phoneNumber })
      .orderBy('otp.expiresAt', 'DESC')
      .select(['otp.phoneNumber', 'otp.otpValue', 'otp.expiresAt'])
      .take(1)
      .getOne();
  }

  async verifyOtp(phoneNumber: number, enteredOtp: number): Promise<object> {
    const getOtpByNumber = await this.getOtp(phoneNumber);

    if (!getOtpByNumber) {
      return { status: false, message: 'OTP not found.' };
    }

    const currentTimestamp = new Date();
    const otpExpirationTimestamp = getOtpByNumber.expiresAt;

    if (currentTimestamp > otpExpirationTimestamp) {
      return { status: false, message: 'OTP has expired.' };
    }

    if (enteredOtp !== getOtpByNumber.otpValue) {
      return { status: false, message: 'Invalid OTP.' };
    }

    return { status: true, message: 'OTP is valid.' };
  }
}
