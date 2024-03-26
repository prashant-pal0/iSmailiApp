import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { errors } from 'src/error'
import { Twilio } from 'twilio'
import * as bcrypt from 'bcrypt'
import { uuid } from 'uuidv4'
import {
  JwtPayload,
  OnboardingTypeEnum,
  UserInterface,
  VerificationCodeInterface,
  VerificationCodeTypeEnum
} from './user.interface'
import { InjectRepository } from '@nestjs/typeorm'
import { UserGeoLocation, Users, VerificationCodes } from './user.entity'
import { Repository } from 'typeorm'
import {
  getS3ListBy,
  getUserBy,
  getUserDetails,
  getVerificationCodesBy,
  userFilterQuery,
  userFilterQueryCount
} from './user.repository'
import { Constants, defaultDomain } from 'helper'
import { JwtService } from '@nestjs/jwt'
import {
  AddUserImagesDTO,
  CreateProfileDTO,
  OnboardDTO,
  UserFilterDTO,
  VerifyOtpDto
} from './user.dto'
import { CommonService } from '../common/common.service'

@Injectable()
export class UserService {
  logger: Logger

  private twilioClient: Twilio

  constructor(
    @InjectRepository(VerificationCodes)
    public readonly verificationCodesRepository: Repository<VerificationCodes>,
    @InjectRepository(Users)
    public readonly userRepository: Repository<Users>,
    @InjectRepository(UserGeoLocation)
    public readonly userGeoLocationRepository: Repository<UserGeoLocation>,
    private readonly configService: ConfigService,
    public readonly jwtService: JwtService,
    public readonly commonService: CommonService // public readonly navigator: Navigator
  ) {
    const accountSid = configService.get('TWILIO_ACCOUNT_SID')
    const authToken = configService.get('TWILIO_AUTH_TOKEN')

    this.twilioClient = new Twilio(accountSid, authToken)
    this.logger = new Logger()
  }

  getHello(): string {
    return 'Hello World!'
  }

  async sendOtp(data: OnboardDTO) {
    if (data.loginType == OnboardingTypeEnum.PhoneOTP) {
      if (!data.countryCode)
        throw new NotFoundException('CountryCode not exists!')
      const phoneNumber = data.data

      const fullPhoneNumber = `${data.data}`

      await this.phoneLogin(fullPhoneNumber)

      const accountSid = this.configService.get('TWILIO_ACCOUNT_SID')
      const authToken = this.configService.get('TWILIO_AUTH_TOKEN')

      const client = require('twilio')(accountSid, authToken)

      const verificationCode = await this.getVerificationCode(
        phoneNumber
        // userId
      )

      client.messages
        .create({
          body: `"Hello IsmailiApp User, Your OTP for verification is: ${verificationCode.verificationCode} Please enter this code to complete the verification process. Thank you,📱🔒`,
          to: `${fullPhoneNumber}`, // Text your number
          from: '+12568012812' // From a valid Twilio number
        })
        .then((message: any) => console.log(message.sid))
        .catch((error: any) => {
          console.log('Error in defning--', error)
          throw errors.InvalidCredentials
        })
      return {
        msg: 'OTP sent successfully on your phone ! ',
        userId: verificationCode.userId
      }
    } else {
      return {
        msg: 'Login Type not supported yet!'
      }
    }
  }

  /** Performs a login using a phone number.
   *  @param {string} phone
   */
  async phoneLogin(phone: string) {
    // Allow for optional "+91" country code
    if (/^(\+91)?\d{10}$/.test(phone)) {
      const userDetails: Partial<UserInterface> = { phone }
      return userDetails
    } else {
      throw errors.InvalidPhone
    }
  }

  /** Generates a verification code for the user and stores it in the database.
   *  @param {string} userId
   *  @param {VerificationCodeTypeEnum}
   */
  async getVerificationCode(phoneNumber: string): Promise<any> {
    try {
      const verificationCode = Math.floor(
        100000 + Math.random() * 900000
      ).toString()
      const salt = this.configService.get('SALT_HASH')
      const verificationCodeHash = await bcrypt.hash(
        verificationCode,
        parseInt(salt)
      )
      const existUser = await getUserBy({ phone: phoneNumber })

      const verificationCodeDetails: VerificationCodeInterface = {
        userId: existUser?.id || uuid(),
        code: verificationCodeHash,
        phone: phoneNumber, // make for email login also phone --> data
        verificationCodeType: VerificationCodeTypeEnum.Phone
      }
      await this.verificationCodesRepository.delete({ phone: phoneNumber })
      await this.verificationCodesRepository.insert(verificationCodeDetails)

      return { ...verificationCodeDetails, verificationCode }
    } catch (error) {
      this.logger.error(error.message)
      throw new BadRequestException(error.message)
    }
  }

  /** Verifies the OTP (One-Time Password) provided by the user.
   * @param {VerifyOTPDTO} verifyOTPDTO
   */
  async verifyOTP(data: VerifyOtpDto): Promise<any> {
    try {
      let userDetails = await getUserBy({ id: data.userId })
      // If user details do not exist, create a new entry

      const verificationCodeDetails = await getVerificationCodesBy({
        userId: data.userId
      })
      console.log('verifiecationCOdeDetails--', verificationCodeDetails)
      if (!verificationCodeDetails) throw errors.InvalidVerificationCode

      const date = new Date()
      if (
        verificationCodeDetails.created.getTime() +
          Constants.OTPExpiry * 60 * 1000 <
        date.getTime()
      ) {
        console.log('OTP verififcation----')
        await this.verificationCodesRepository.delete({ userId: data.userId })

        throw errors.InvalidVerificationCode
      }

      if (
        !(await bcrypt.compare(
          data.otp.toString(),
          verificationCodeDetails.code
        ))
      ) {
        console.log('verifiation code compared----')
        await this.verificationCodesRepository.delete({ userId: data.userId })

        throw errors.InvalidVerificationCode
      }

      let existingUser = false
      if (!userDetails) {
        const details = {
          id: data.userId,
          phone: verificationCodeDetails.phone,
          isPhoneVerified: true,
          lastLogin: new Date()
        }
        // await t/his.userRepository.create()
        await this.userRepository.insert(details)
      } else {
        existingUser = true
        await this.userRepository.update(userDetails.id, {
          isPhoneVerified: true,
          lastLogin: new Date()
        })
      }

      await this.verificationCodesRepository.delete({ userId: data.userId })

      const token = await this.generateToken(
        data.userId,
        verificationCodeDetails.phone
      )

      return {
        message: 'verified successfully',
        data: {
          token,
          userId: verificationCodeDetails.userId,
          existingUser
        }
      }
    } catch (error) {
      this.logger.error('Error', JSON.stringify(error.message))
      throw new BadRequestException(error.message)
    }
  }

  /** Generates a token for authentication.
   * @param {string} id
   * @param {string} email
   */
  async generateToken(id: string, phone: string): Promise<string> {
    const payload: JwtPayload = { id, phone }
    // const configurationDetails = await getConfigurationBy({})
    return this.jwtService.sign(payload, { secret: 'mykeysecret' })
  }

  /** Adds or updates the user profile.
 * @param {CreateProfileDTO} createProfileDTO
 * @param {string} userId 

*/
  async addUserProfile(
    {
      fullName,
      phone,
      bio,
      zodiac,
      smoke,
      drink,
      lookingFor,
      email,
      birthday,
      gender,
      religion,
      height,
      education
    }: CreateProfileDTO,
    userId: string
  ) {
    try {
      let userDetails = await getUserBy({ id: userId })
      // const updateSocialProfile = {
      //   instagram: '',
      //   discord: '',
      //   telegram: '',
      //   twitter: ''
      // }
      // if (socialProfile) {
      //   updateSocialProfile.instagram = socialProfile['instagram']
      //     ? socialProfile['instagram']
      //     : userDetails.socialProfile && userDetails.socialProfile['instagram']
      //       ? userDetails.socialProfile['instagram']
      //       : ''
      //   updateSocialProfile.discord = socialProfile['discord']
      //     ? socialProfile['discord']
      //     : userDetails.socialProfile && userDetails.socialProfile['discord']
      //       ? userDetails.socialProfile['discord']
      //       : ''
      //   updateSocialProfile.telegram = socialProfile['telegram']
      //     ? socialProfile['telegram']
      //     : userDetails.socialProfile && userDetails.socialProfile['telegram']
      //       ? userDetails.socialProfile['telegram']
      //       : ''
      //   updateSocialProfile.twitter = socialProfile['twitter']
      //     ? socialProfile['twitter']
      //     : userDetails.socialProfile && userDetails.socialProfile['twitter']
      //       ? userDetails.socialProfile['twitter']
      //       : ''
      // }
      let emailUpdate = false
      if (email) {
        const regexPattern = new RegExp(defaultDomain, 'g')
        if (regexPattern.test(userDetails.email)) {
          emailUpdate = true
        }
      }

      if (emailUpdate) {
        // check if email already exists
        const emailUserDetails = await getUserBy({ email })
        if (emailUserDetails) throw errors.EmailAlreadyExists
      }
      const userImages = await this.addUserImagesSync(userId)
      const data: Partial<Users> = {
        fullName: fullName ? fullName : userDetails.fullName,
        phone: phone ? phone : userDetails.phone,
        birthday: birthday ? birthday : userDetails.birthday,
        height: height ? height : userDetails.height,
        gender: gender ? gender : userDetails.gender,
        education: education ? education : userDetails.education,
        religion: religion ? religion : userDetails.religion,
        bio: bio ? bio : userDetails.bio,
        email: emailUpdate ? email : userDetails.email,
        zodiac: zodiac ? zodiac : userDetails.zodiac,
        drink: drink ? drink : userDetails.drink,
        smoke: smoke ? smoke : userDetails.smoke,
        lookingFor: lookingFor ? lookingFor : userDetails.lookingFor,
        profilePic: userImages.length > 0 ? userImages[0].s3link : null
      }

      await this.userRepository.update({ id: userId }, data)

      userDetails = await getUserBy({ id: userId })
      const completeUserInfo = { ...userDetails, userImages }

      return {
        message: 'User profile info saved successfully.',
        data: completeUserInfo
      }
    } catch (error) {
      this.logger.error(error.message)
      throw new BadRequestException(error.message)
    }
  }

  /** Retrieves the user profile by user ID.
   * @param {string} userId
   */
  async getUserProfile(userId: string) {
    try {
      const userDetails = await getUserDetails(userId)
      const regexPattern = new RegExp(defaultDomain, 'g')
      userDetails.email = regexPattern.test(userDetails.email)
        ? ''
        : userDetails.email

      if (userDetails.birthday)
        userDetails.age =
          new Date().getFullYear() -
          parseInt(userDetails.birthday.split('-')[0])
      const userImages = await this.addUserImagesSync(userId)
      const completeUserInfo: any = {
        ...userDetails,
        userImages
      }
      return { message: 'User profile details', data: completeUserInfo }
    } catch (error) {
      this.logger.error(error.message)
      throw new BadRequestException(error.message)
    }
  }

  async addUserImagesSync(userId: string) {
    const s3Images = await getS3ListBy({ userId })
    return s3Images.filter(s3list => {
      if (s3list.s3link) return true
    })
  }

  async addUserImages(
    { imageUrl, imageType }: AddUserImagesDTO,
    userId: string
  ) {
    try {
      const condition: any = { where: { userId } }
      const userDetails = await this.userRepository.find(condition)
      if (!userDetails) throw errors.UserNotFound
      const data = {
        id: uuid(),
        userId,
        imageUrl,
        imageType
      }
      await this.userRepository.save(data)

      return {
        message: 'User Images saved successfully.'
      }
    } catch (error) {
      this.logger.error(error.message)
      throw new BadRequestException(error.message)
    }
  }

  async getRandomUser(userId: string) {
    // Fetch a random user from the database (you can customize this logic)
    let users = await this.userRepository.find()
    let randomIndex = Math.floor(Math.random() * users.length)
    let randomUser = users[randomIndex].id

    if (randomUser === userId) {
      do {
        randomIndex = Math.floor(Math.random() * users.length)
        randomUser = users[randomIndex].id
      } while (randomUser === userId)
    }

    const yourLocation = await this.userGeoLocationRepository.findOne({
      where: { userId: userId }
    })
    const randomUserLocation = await this.userGeoLocationRepository.findOne({
      where: { userId: randomUser }
    })

    const randomLat = randomUserLocation.lat
    const randomLong = randomUserLocation.long

    const awayFrom = await this.commonService.getLocation(
      yourLocation.lat,
      yourLocation.long,
      randomLat,
      randomLong
    )
    console.log(awayFrom)

    return {
      data: users[randomIndex],
      distance: awayFrom
    }
  }

  async getUsersWithFilters({
    fullName,
    phone,
    birthday,
    religion,
    height,
    education,
    gender,
    bio,
    email,
    zodiac,
    smoke,
    drink,
    page,
    limit
  }: UserFilterDTO) {
    try {
      const filterData = await userFilterQuery(
        page,
        limit,
        fullName,
        phone,
        birthday,
        religion,
        height,
        education,
        gender,
        bio,
        email,
        zodiac,
        smoke,
        drink
      )
      const listsCount = await userFilterQueryCount(
        fullName,
        phone,
        birthday,
        religion,
        height,
        education,
        gender,
        bio,
        email,
        zodiac,
        smoke,
        drink
      )
      if (!filterData) throw errors.UserNotFound

      return {
        message: 'Filtered Data fetched Successfully. ',
        data: filterData,
        count: listsCount
      }
    } catch (error) {
      throw new Error('Error fetching users with filters.')
    }
  }
}
