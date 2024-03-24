import { Body, Controller, Get, HttpCode, HttpStatus, NotFoundException, Param, Post, Query } from '@nestjs/common'
import { UserService } from './user.service'
import { AddUserImagesDTO, CreateProfileDTO, OnboardDTO, UserDTO, UserFilterDTO, VerifyOtpDto } from './user.dto'
import { Auth, GetUserId } from './user.auth'
import { ApiBadRequestResponse, ApiBearerAuth, ApiForbiddenResponse, ApiOperation, ApiTags } from '@nestjs/swagger'


@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/sendOtp')
  async sendOtp(@Body() data: OnboardDTO): Promise<{ msg: string }> {
    // let prefix = '+91'
    // let phone = prefix.concat(data.phone)
    return await this.userService.sendOtp(data)
  }

  @Post('/verifyOtp')
  async verifyOtp(@Body() data: VerifyOtpDto): Promise<{ msg: string }> {
    // let prefix = '+91';
    // let phone = prefix.concat(data.phone);
    return await this.userService.verifyOTP(data)
  }

  @Post('/profile')
  @Auth()
  @ApiBearerAuth()
  async addUserProfile(@GetUserId('id') userId: string, @Body() createProfileDTO: CreateProfileDTO) {
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
  async addUserImages(@GetUserId('id') userId: string, @Body() addUserImagesDTO: AddUserImagesDTO) {
    return await this.userService.addUserImages(addUserImagesDTO, userId)
  }

  @Get('/random')
  @Auth()
  @ApiBearerAuth()
  async getRandomUser(@GetUserId('id') userId: string) {
    return this.userService.getRandomUser(userId)
  }

  @Get('/filter')
  async getUsers(@Query() userFilterDTO: UserFilterDTO) {
    try {
      return await this.userService.getUsersWithFilters(userFilterDTO)
    } catch (error) {
      throw new NotFoundException('Users not found.')
    }
  }
}
