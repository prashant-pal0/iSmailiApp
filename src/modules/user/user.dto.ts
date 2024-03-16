import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Length,
  Matches,
  Max,
  Min,
  MinLength,
  ValidateIf
} from 'class-validator'
import { EducationLevel, GenderEnum, OnboardingTypeEnum, PurposeEnum, UserImageType, zodiacEnum } from './user.interface'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

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
  @ApiProperty({
    description: 'The type of login used to onboard the user (Email = 1, Facebook = 2, Google = 3, Phone = 4)',
  })
  @IsNumber()
  @IsNotEmpty()
  loginType: OnboardingTypeEnum

  @ApiProperty({ description: 'Email/phone/ExternalToken of the user' })
  @IsNotEmpty()
  @IsString()
  data: string

  @ApiProperty({ description: 'Email/phone/ExternalToken of the user' })
  @ValidateIf((o: OnboardDTO) => o.loginType === OnboardingTypeEnum.PhoneOTP)
  @IsNotEmpty()
  countryCode?: string
}

export class VerifyOtpDto {
  @ApiProperty({ description: 'The verification code received on the provided data' })
  @IsString()
  userId: string;

  @ApiProperty({ description: 'The verification code received on the provided data' })
  @IsString()
  @IsNotEmpty({ message: 'OTP is required' })
  @Length(6, 6, { message: 'OTP must be exactly 6 characters long' })
  otp: string
}

export class SocialProfileDTO {
  @ApiProperty({ description: 'The verification code received on the provided data' })
  @IsOptional()
  @IsString()
  instagram: string

  @ApiProperty({ description: 'The verification code received on the provided data' })
  @IsOptional()
  @IsString()
  discord: string

  @ApiProperty({ description: 'The verification code received on the provided data' })
  @IsOptional()
  @IsString()
  telegram: string

  @ApiProperty({ description: 'The verification code received on the provided data' })
  @IsOptional()
  @IsString()
  twitter: string

  @ApiProperty({ description: 'The verification code received on the provided data' })
  @IsOptional()
  @IsString()
  youtube: string
}
export class LookingForDTO {
  @ApiProperty({ description: 'The ID of template.' })
  @IsNotEmpty()
  @IsEnum(PurposeEnum)
  purpose: PurposeEnum;

  
  @ApiProperty({ description: 'The ID of template.' })
  @IsNotEmpty()
  @IsString()
  dreamDate: string;

  @ApiProperty({ description: 'The ID of template.' })
  @IsNotEmpty()
  @IsNumber()
  @Min(18)
  ageFrom: number;

  @ApiProperty({ description: 'The ID of template.' })
  @IsNotEmpty()
  @IsNumber()
  @Max(99)
  ageTo: number;

  @ApiProperty({ description: 'The ID of template.' })
  @IsNotEmpty()
  language: string;
}

export class ZodiacDTO {
  @IsNotEmpty()
  @IsEnum(zodiacEnum)
  zodiac: zodiacEnum;


  @IsNotEmpty()
  @IsEnum(['Regularly', 'Never', 'Socially'])
  smoke: string;

  @IsNotEmpty()
  @IsEnum(['Regularly', 'Never', 'Socially'])
  drink: string;

}

export class CreateProfileDTO {
  @ApiPropertyOptional({ description: 'Name of the user' })
  @IsOptional()
  @IsString()
  name: string

  
  @ApiPropertyOptional({ description: 'Phone number of the user' })
  @IsOptional()
  @IsString()
  phone: string

  @ApiPropertyOptional({ description: 'Bio of the user' })
  @IsOptional()
  @IsString()
  birthday: string

  @ApiPropertyOptional({ description: 'Bio of the user' })
  @IsOptional()
  @IsString()
  religion: string

  @ApiPropertyOptional({ description: 'Bio of the user' })
  @IsOptional()
  @IsString()
  height: string

  
  @IsNotEmpty()
  @IsEnum(EducationLevel)
  education: EducationLevel;

  @ApiPropertyOptional({ description: 'Bio of the user' })
  @IsString()
  gender: string



  // @ApiPropertyOptional({ description: 'Bio of the user' })
  // @IsOptional()
  // @IsObject()
  // yourInterest:object


  @ApiPropertyOptional({ description: 'Bio of the user' })
  @IsOptional()
  lookingFor:LookingForDTO

  @ApiPropertyOptional({ description: 'Bio of the user' })
  @IsOptional()
  @IsString()
  bio: string


  // @ApiPropertyOptional({ description: 'Social profiles of the user' })
  // @IsOptional()
  // socialProfile: SocialProfileDTO

  @ApiPropertyOptional({ description: 'The email address of the user profile', format: 'email' })
  @IsOptional()
  @IsEmail()
  email: string

  @ApiPropertyOptional({ description: 'The email address of the user profile', format: 'email' })
  @IsOptional()
  ZodiacSign:  ZodiacDTO


}



export class AddUserImagesDTO {

  @ApiPropertyOptional({ description: 'Profile picture link' })
  @IsOptional()
  @IsString()
  imageUrl: string

  @ApiProperty({ description: 'User image type ' })
  @IsOptional()
  @IsString()
  imageType: UserImageType

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
