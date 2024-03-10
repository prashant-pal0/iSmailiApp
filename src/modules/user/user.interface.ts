export enum OnboardingTypeEnum {
    EmailOTP = 1,
    Facebook = 2,
    Google = 3,
    PhoneOTP = 4,
    External = 5,
  }


  export interface UserInterface {
    id: string
    email: string
    password?: string
    emailVerified?: boolean
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