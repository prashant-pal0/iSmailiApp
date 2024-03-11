import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common'
import { UserService } from './user.service'
import { AddUserImagesDTO, CreateProfileDTO, OnboardDTO, UserDTO, VerifyOtpDto } from './user.dto'
import { Auth, GetUserId } from './user.auth'
import {
  ApiBadRequestResponse,
  ApiBearerAuth, ApiForbiddenResponse, ApiOperation

} from '@nestjs/swagger'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/sendOtp')
  async sendOtp(@Body() data: OnboardDTO): Promise<{ msg: string }> {
    // let prefix = '+91'
    // let phone = prefix.concat(data.phone)
    return await this.userService.sendOtp(data)
  }

  @Post('/verifyOtp/:id')
  // @Auth()
  // @ApiBearerAuth()
  async verifyOtp(
    @Param('id') userId: string,
    @Body() data: VerifyOtpDto
  ): Promise<{ msg: string }> {
    // let prefix = '+91';
    // let phone = prefix.concat(data.phone);
    console.log('userId---', userId)

    return await this.userService.verifyOTP(userId, data.otp)
  }

  @Post('profile')
  @Auth()
  async addUserProfile(
    @GetUserId('id') userId: string,
    @Body() createProfileDTO: CreateProfileDTO
  ) {
    return await this.userService.addUserProfile(createProfileDTO, userId)
  }



  @Get('details')
  @Auth()
  @ApiForbiddenResponse({ description: 'Invalid access token' })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Fetch profile details' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @HttpCode(HttpStatus.OK)
  async getUserProfile(@GetUserId('id') userId: string) {
    return await this.userService.getUserProfile(userId)
  }

  @Post('/image')
  @Auth()
  @ApiBearerAuth()
  async addUserImages(
    @GetUserId('id') userId: string,
    @Body() addUserImagesDTO: AddUserImagesDTO
  ) {
    return await this.userService.addUserImages(addUserImagesDTO, userId)
  }


  @Get('/random')
  async getRandomUser() {
    return this.userService.getRandomUser();

  }


  


}
