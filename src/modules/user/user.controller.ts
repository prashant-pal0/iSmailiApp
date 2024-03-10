import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateProfileDTO, OnboardDTO, UserDTO, VerifyOtpDto } from './user.dto';
import { Auth, GetUserId } from './user.auth';

@Controller('user')

export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('/SendOtp')
  async sendOtp(@Body() data: { phone: string }): Promise<{ msg: string }> {
    let prefix = '+91';
    let phone = prefix.concat(data.phone);
    return await this.userService.sendOtp(phone);
  }

  @Post('/VerifyOtp')
  @Auth()
  // @ApiBearerAuth()
  async verifyOtp(@GetUserId('id') userId: string,
    @Body() data: VerifyOtpDto,
  ): Promise<{ msg: string }> {
    // let prefix = '+91';
    // let phone = prefix.concat(data.phone);
    return await this.userService.verifyOTP(userId, data.otp);
  }


  @Post('profile')
  @Auth()
  async addUserProfile(@GetUserId('id') userId: string, @Body() createProfileDTO: CreateProfileDTO) {
    return await this.userService.addUserProfile(createProfileDTO, userId)
  }


}