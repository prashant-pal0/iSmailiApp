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
  ValidateIf,
} from 'class-validator'
import { EducationLevel, GenderEnum, OnboardingTypeEnum, PurposeEnum, UserImageType, zodiacEnum } from './user.interface'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'

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
  userId: string

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
 
}

export class ZodiacDTO {

}

export class CreateProfileDTO {
  @ApiPropertyOptional({ description: 'Name of the user' })
  @IsOptional()
  @IsString()
  fullName: string;

  @ApiPropertyOptional({ description: 'Phone number of the user' })
  @IsOptional()
  @IsString()
  phone: string;

  @ApiPropertyOptional({ description: 'Bio of the user' })
  @IsOptional()
  @IsString()
  birthday: string;

  @ApiPropertyOptional({ description: 'Bio of the user' })
  @IsOptional()
  @IsString()
  religion: string;

  @ApiPropertyOptional({ description: 'Bio of the user' })
  @IsOptional()
  @IsString()
  height: string;

  @IsNotEmpty()
  @IsEnum(EducationLevel)
  education: EducationLevel;

  @ApiPropertyOptional({ description: 'Bio of the user' })
  @IsString()
  gender: string;

  // @ApiPropertyOptional({ description: 'Bio of the user' })
  // @IsOptional()
  // @IsObject()
  // yourInterest:object

  @ApiPropertyOptional({ description: 'Bio of the user' })
  @IsOptional()
  lookingFor: LookingForDTO;

  @ApiPropertyOptional({ description: 'Bio of the user' })
  @IsOptional()
  @IsString()
  bio: string;

  // @ApiPropertyOptional({ description: 'Social profiles of the user' })
  // @IsOptional()
  // socialProfile: SocialProfileDTO

  @ApiPropertyOptional({ description: 'The email address of the user profile', format: 'email' })
  @IsOptional()
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ description: 'The zodiac sign of the user.' })
  @IsEnum(zodiacEnum)
  zodiac?: zodiacEnum;

  @ApiPropertyOptional({ description: 'The smoking habit of the user.' })
  @IsEnum(['Regularly', 'Never', 'Socially'])
  smoke?: string;

  @ApiPropertyOptional({ description: 'The drinking habit of the user.' })
  @IsEnum(['Regularly', 'Never', 'Socially'])
  drink?: string;
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

export class PageDTO {
  @ApiProperty({ description: 'Number of page' })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page: number

  @ApiProperty({ description: 'Number of required Data on each page' })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(1000)
  limit: number
}


export class UserFilterDTO extends PageDTO {
  @ApiPropertyOptional({ description: 'Name of the user' })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiPropertyOptional({ description: 'Phone number of the user' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: 'Birthday of the user' })
  @IsOptional()
  @IsString()
  birthday?: string;

  @ApiPropertyOptional({ description: 'Religion of the user' })
  @IsOptional()
  @IsString()
  religion?: string;

  @ApiPropertyOptional({ description: 'Height of the user' })
  @IsOptional()
  @IsString()
  height?: string;

  // @ApiPropertyOptional({ description: 'The ID of template.' })
  // @IsOptional()
  // @IsEnum(PurposeEnum)
  // purpose?: PurposeEnum;

  // @ApiPropertyOptional({ description: 'The ID of template.' })
  // @IsOptional()
  // @IsString()
  // dreamDate?: string;

  // @ApiPropertyOptional({ description: 'The ID of template.' })
  // @IsOptional()
  // @IsNumber()
  // ageFrom?: number;

  // @ApiPropertyOptional({ description: 'The ID of template.' })
  // @IsOptional()
  // @IsNumber()
  // ageTo?: number;

  @ApiPropertyOptional({ description: 'The ID of template.' })
  @IsOptional()
  language?: string;

  @ApiPropertyOptional({ description: 'Education level of the user' })
  @IsOptional()
  education?: EducationLevel;

  @ApiPropertyOptional({ description: 'Gender of the user' })
  @IsOptional()
  @IsString()
  gender?: string;

  // @ApiPropertyOptional({ description: 'What the user is looking for' })
  // @IsOptional()
  // lookingFor?: LookingForDTO;

  @ApiPropertyOptional({ description: 'Bio of the user' })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({ description: 'Email address of the user' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ description: 'The zodiac sign of the user.' })
  @IsOptional()
  zodiac?: zodiacEnum;

  @ApiPropertyOptional({ description: 'The smoking habit of the user.' })
  @IsOptional()
  smoke?: string;

  @ApiPropertyOptional({ description: 'The drinking habit of the user.' })
  @IsOptional()
  drink?: string;
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
