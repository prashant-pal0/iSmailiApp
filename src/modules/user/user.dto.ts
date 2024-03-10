import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Matches,
  MinLength,
  ValidateIf
} from 'class-validator'
import { OnboardingTypeEnum } from './user.interface'

export class UserDTO {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsString()
  @IsNotEmpty()
  password: string
}

export class OnboardDTO {
  @IsNumber()
  @IsNotEmpty()
  loginType: OnboardingTypeEnum

  @IsNotEmpty()
  @IsString()
  data: string

  @ValidateIf((o: OnboardDTO) => o.loginType === OnboardingTypeEnum.PhoneOTP)
  @IsNotEmpty()
  countryCode?: string
}

export class VerifyOtpDto {
  // @IsString()
  // @IsNotEmpty({ message: 'Phone number is required' })
  // @Matches(/^\d{10}$/, { message: 'Invalid phone number format' })
  // phone: string;

  @IsString()
  @IsNotEmpty({ message: 'OTP is required' })
  @Length(6, 6, { message: 'OTP must be exactly 6 characters long' })
  otp: string
}

export class SocialProfileDTO {
  @IsOptional()
  @IsString()
  instagram: string

  @IsOptional()
  @IsString()
  discord: string

  @IsOptional()
  @IsString()
  telegram: string

  @IsOptional()
  @IsString()
  twitter: string

  @IsOptional()
  @IsString()
  youtube: string
}

export class CreateProfileDTO {
  @IsOptional()
  @IsString()
  name: string

  @IsOptional()
  @IsString()
  phone: string

  @IsOptional()
  @IsString()
  bio: string

  @IsOptional()
  @IsString()
  profilePic: string

  @IsOptional()
  socialProfile: SocialProfileDTO

  @IsOptional()
  @IsEmail()
  email: string
}

export class RegisterDto {
  @IsEmail()
  email: string

  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  @MinLength(7)
  password: string

  @IsString()
  @IsNotEmpty()
  @Matches(/^\+[1-9]\d{1,14}$/)
  phoneNumber: string
}

export default RegisterDto
