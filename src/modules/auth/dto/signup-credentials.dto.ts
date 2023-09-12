import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsEmail,
  MinLength,
  Matches,
} from 'class-validator';
import { IsNumberLength } from 'src/decorators/IsNumberLength.decorator';

// Step 1: Phone Number Verification DTO
export class PhoneNumberDto {
  @ApiProperty({
    required: true,
    default: 9746116168,
    description: 'Phone number',
  })
  @IsNotEmpty({ message: 'Phone number is required' })
  @IsNumber(undefined, {
    message: 'Phone Number must be number',
  })
  phoneNumber: number;

  @ApiProperty({
    required: true,
    default: '+91',
    description: 'Country code',
  })
  @IsNotEmpty({ message: 'Country code is required' })
  @IsString({ message: 'Country code must be a string' })
  readonly countryCode: string;
}

// Step 2: OTP Verification DTO
export class OTPVerificationDto {
  @ApiProperty({
    required: true,
    default: 9746116168,
    description: 'Phone number',
  })
  @IsNotEmpty({ message: 'Phone number is required' })
  @IsNumber({}, { message: 'Phone number must be a valid numeric value' })
  phoneNumber: number;

  @ApiProperty({
    required: true,
    default: 123456,
    description: 'OTP',
    minLength: 6,
    maxLength: 6,
  })
  @IsNotEmpty({ message: 'OTP is required' })
  @IsNumberLength(6, { message: 'OTP must be 6 digits' })
  @IsNumber({}, { message: 'OTP must be a valid numeric value' })
  otp: number;
}

// Step 3: Collect Additional Details DTO
export class SignupCredentialsDto {
  @IsNotEmpty({ message: 'First name is required' })
  @IsString({ message: 'First name must be a string' })
  firstName: string;

  @IsNotEmpty({ message: 'Last name is required' })
  @IsString({ message: 'Last name must be a string' })
  lastName: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$/, {
    message: 'Password is too weak',
  })
  password: string;

  @IsNotEmpty({ message: 'Confirm password is required' })
  confirmPassword: string;
}
