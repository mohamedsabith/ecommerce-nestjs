import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Otp } from '../entities/otp.entity';
import { JwtPayload } from '../interface/jwt-payload.interface';
import 'dotenv/config';

@Injectable()
export class JwtForgotPasswordStrategy extends PassportStrategy(
  Strategy,
  'otp-token',
) {
  constructor(
    @InjectRepository(Otp)
    private otpRepository: Repository<Otp>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('token'),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_FORGOT_PASSWORD_TOKEN_SECRET,
    });
  }

  async validate(payload: JwtPayload) {
    const { phoneNumber } = payload;

    const otp = this.otpRepository
      .createQueryBuilder('otp')
      .where('otp.phoneNumber = :phoneNumber', { phoneNumber })
      .orderBy('otp.expiresAt', 'DESC')
      .select(['otp.phoneNumber', 'otp.otpValue', 'otp.expiresAt'])
      .take(1)
      .getOne();

    if (!otp) {
      throw new UnauthorizedException();
    }

    return otp;
  }
}
