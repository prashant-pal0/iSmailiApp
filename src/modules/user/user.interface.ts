export enum OnboardingTypeEnum {
  EmailOTP = 1,
  Facebook = 2,
  Google = 3,
  PhoneOTP = 4,
  External = 5,
}

export enum UserImageType {
  Profile = 1,
}

export enum zodiacEnum {
  Aries = 1,
  Taurus = 2,
  Gemini = 3,
}

export enum EducationLevel {
  HighSchool = 1,
  Bachelor = 2,
  Master = 3,
}

export enum PurposeEnum {}

export enum GenderEnum {}

export interface UserInterface {
  id: string
  email: string
  password?: string
  emailVerified?: boolean
  gender: string
  education: EducationLevel
  fbId?: string
  instaId?: string
  name?: string
  phone?: string
  isPhoneVerified?: boolean
  bio?: string
  profilePic?: string
  socialProfile?: object
  lastLogin: Date
  role: RolesEnum
}

export enum RolesEnum {
  User = 1,
  Admin = 2,
  Owner = 3,
  SuperAdmin = 4,
}

export interface VerificationCodeInterface {
  userId: string
  code: string
  verificationCodeType: VerificationCodeTypeEnum
  phone: string
}

export enum VerificationCodeTypeEnum {
  // Email = 1,
  Phone = 1,
}

export interface JwtPayload {
  id: string
  phone: string
}
