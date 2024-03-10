import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { errors } from 'src/error';
import { Twilio } from 'twilio';
import * as bcrypt from 'bcrypt'
import { uuid } from 'uuidv4';
import { JwtPayload, UserInterface, VerificationCodeInterface, VerificationCodeTypeEnum } from './user.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Users, VerificationCodes } from './user.entity';
import { Repository } from 'typeorm';
import { getUserBy, getVerificationCodesBy } from './user.repository';
import { Constants, defaultDomain } from 'helper';
import { JwtService } from '@nestjs/jwt'
import { CreateProfileDTO } from './user.dto';


@Injectable()
export class UserService {
  logger: Logger

  private twilioClient: Twilio;

  constructor(
    @InjectRepository(VerificationCodes)
    public readonly verificationCodesRepository: Repository<VerificationCodes>,
    public readonly userRepository: Repository<Users>,
    private readonly configService: ConfigService,
    public readonly jwtService: JwtService,
  ) {
    const accountSid = configService.get('TWILIO_ACCOUNT_SID');
    const authToken = configService.get('TWILIO_AUTH_TOKEN');

    this.twilioClient = new Twilio(accountSid, authToken);
    this.logger = new Logger()

  }

  getHello(): string {
    return 'Hello World!';
  }

  async sendOtp(phoneNumber: string) {
    console.log(phoneNumber)
    await this.phoneLogin(phoneNumber)

    const accountSid = this.configService.get('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get('TWILIO_AUTH_TOKEN');

    const client = require('twilio')(accountSid, authToken);

    const verificationCode = await this.getVerificationCode(phoneNumber)

    client.messages
      .create({
        body: `"Hello IsmailiApp User, Your OTP for verification is: ${verificationCode.code} Please enter this code to complete the verification process. Thank you,📱🔒`,
        to: `${phoneNumber}`, // Text your number
        from: '+12568012812', // From a valid Twilio number
      })
      .then((message: any) => console.log(message.sid))
    return { msg: 'OTP sent successfully on your phone ! ', userId: verificationCode.userId };
  }

  /** Performs a login using a phone number.
    *  @param {string} phone
    */
  async phoneLogin(phone: string) {
    // Allow for optional "+91" country code
    if (/^(\+91)?\d{10}$/.test(phone)) {
      const userDetails: Partial<UserInterface> = { phone }
      return userDetails;
    } else {
      throw errors.InvalidPhone;
    }
  }


  /** Generates a verification code for the user and stores it in the database.
  *  @param {string} userId
  *  @param {VerificationCodeTypeEnum}
  */
  async getVerificationCode(phoneNumber: string): Promise<any> {
    try {
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
      const salt = this.configService.get('SALT_HASH')
      const verificationCodeHash = await bcrypt.hash(verificationCode, parseInt(salt))
      const verificationCodeDetails: VerificationCodeInterface = {
        userId: uuid(),
        code: verificationCodeHash,
        phone: phoneNumber,
        verificationCodeType: VerificationCodeTypeEnum.Phone,
      }
      console.log(verificationCodeDetails)
      // await this.verificationCodesRepository.delete({ phone:phoneNumber })
      await this.verificationCodesRepository.insert(verificationCodeDetails)

      return verificationCodeDetails
    } catch (error) {
      this.logger.error(error.message)
      throw new BadRequestException(error.message)
    }
  }


  /** Verifies the OTP (One-Time Password) provided by the user.
 * @param {VerifyOTPDTO} verifyOTPDTO
 * @param {number} operatorId
 */
  async verifyOTP(userId: string, code: string): Promise<any> {
    try {
      let userDetails = await getUserBy({ id: userId })
  
      // If user details do not exist, create a new entry
      if (!userDetails) {
        userDetails = await this.userRepository.create({ id: userId, isPhoneVerified: false })
      }
  
      const verificationCodeDetails = await getVerificationCodesBy({ userId })
      if (!verificationCodeDetails) throw errors.InvalidVerificationCode
  
      const date = new Date()
      if (verificationCodeDetails.created.getTime() + Constants.OTPExpiry * 60 * 1000 < date.getTime()) {
        throw errors.InvalidVerificationCode
      }
  
      if (!(await bcrypt.compare(code.toString(), verificationCodeDetails.code))) {
        throw errors.InvalidVerificationCode
      }
  
      if (!userDetails.isPhoneVerified) {
        await this.userRepository.update(userDetails.id, { isPhoneVerified: true })
      }
  
      await this.verificationCodesRepository.delete({ userId })
      await this.userRepository.update({ id: userDetails.id }, { lastLogin: new Date() })
  
      const token = await this.generateToken(userId, verificationCodeDetails.phone)
  
      return {
        message: "verified successfully",
        data: {
          token,
          userId: verificationCodeDetails.userId
        },
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
    return this.jwtService.sign(payload, { expiresIn: "1h" })
  }


  /** Adds or updates the user profile.
 * @param {CreateProfileDTO} createProfileDTO
 * @param {string} userId 

*/
  async addUserProfile({ name, phone, bio, profilePic, socialProfile, email }: CreateProfileDTO, userId: string) {
    try {
      let userDetails = await getUserBy({ id: userId })
      const updateSocialProfile = {
        instagram: '',
        discord: '',
        telegram: '',
        twitter: '',
      }
      if (socialProfile) {
        updateSocialProfile.instagram = socialProfile['instagram']
          ? socialProfile['instagram']
          : userDetails.socialProfile && userDetails.socialProfile['instagram']
            ? userDetails.socialProfile['instagram']
            : ''
        updateSocialProfile.discord = socialProfile['discord']
          ? socialProfile['discord']
          : userDetails.socialProfile && userDetails.socialProfile['discord']
            ? userDetails.socialProfile['discord']
            : ''
        updateSocialProfile.telegram = socialProfile['telegram']
          ? socialProfile['telegram']
          : userDetails.socialProfile && userDetails.socialProfile['telegram']
            ? userDetails.socialProfile['telegram']
            : ''
        updateSocialProfile.twitter = socialProfile['twitter']
          ? socialProfile['twitter']
          : userDetails.socialProfile && userDetails.socialProfile['twitter']
            ? userDetails.socialProfile['twitter']
            : ''
      }
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
      const data: Partial<Users> = {
        name: name ? name : userDetails.name,
        phone: phone ? phone : userDetails.phone,
        bio: bio ? bio : userDetails.bio,
        profilePic: profilePic ? profilePic : userDetails.profilePic,
        socialProfile: updateSocialProfile,
        email: emailUpdate ? email : userDetails.email,
      }
      await this.userRepository.update({ id: userId }, data)
      userDetails = await getUserBy({ id: userId }, [
        'id',
        'email',
        'emailVerified',
        'vaccount',
        'name',
        'phone',
        'operatorId',
        'bio',
        'profilePic',
        'socialProfile',
      ])
      const completeUserInfo = { ...userDetails }

      return { message: 'User profile info saved successfully.', data: completeUserInfo }
    } catch (error) {
      this.logger.error(error.message)
      throw new BadRequestException(error.message)
    }
  }


}