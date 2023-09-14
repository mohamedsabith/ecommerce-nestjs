import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Between, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Otp } from '../entities/otp.entity';
import { Twilio } from 'twilio';
import { JwtTokenService } from './jwt.service';

@Injectable()
export class OtpService {
  private twilioClient: Twilio;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Otp)
    private readonly otpRepository: Repository<Otp>,
    private jwtService: JwtTokenService,
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
    const latestOtp = await this.otpRepository.findOne({
      where: { phoneNumber },
      order: { createdAt: 'DESC' },
    });

    let otpSendCount = 1;

    if (latestOtp) {
      otpSendCount = latestOtp.otpSendCount + 1;
    }
    return this.otpRepository.save({
      otpValue,
      phoneNumber,
      expiresAt,
      otpSendCount,
    });
  }

  async getOtpCountForDay(phoneNumber: number): Promise<number> {
    try {
      const currentDate = new Date();

      const startOfDay = new Date(currentDate);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(currentDate);
      endOfDay.setHours(23, 59, 59, 999);

      const otpCount = await this.otpRepository.count({
        where: {
          phoneNumber,
          createdAt: Between(startOfDay, endOfDay),
        },
      });

      return otpCount;
    } catch (error) {
      console.error(
        `Error retrieving OTP count for ${phoneNumber}: ${error.message}`,
      );
      throw error;
    }
  }

  async sendOTP(
    phoneNumber: number,
    countryCode: string,
    otp: number,
  ): Promise<string> {
    try {
      const otpCount = await this.getOtpCountForDay(phoneNumber);
      const otpLimit = 10;

      if (otpCount >= otpLimit) {
        return 'OTP limit exceeded. Try again later.';
      }

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

  async getOtpByNumber(phoneNumber: number): Promise<Otp | undefined> {
    return this.otpRepository
      .createQueryBuilder('otp')
      .where('otp.phoneNumber = :phoneNumber', { phoneNumber })
      .orderBy('otp.expiresAt', 'DESC')
      .select(['otp.phoneNumber', 'otp.otpValue', 'otp.expiresAt'])
      .take(1)
      .getOne();
  }

  async verifyOtp(phoneNumber: number, enteredOtp: number): Promise<object> {
    const getOtpByNumber = await this.getOtpByNumber(phoneNumber);

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

    const jwtPayload = {
      firstName: enteredOtp.toString(),
      lastName: enteredOtp.toString(),
      email: '@gmail.com',
      phoneNumber: phoneNumber,
      role: 'User',
    };

    return {
      status: true,
      message: 'OTP is valid.',
      phoneNumber,
      token: await this.jwtService.getAccessToken(jwtPayload, 5),
    };
  }
}
