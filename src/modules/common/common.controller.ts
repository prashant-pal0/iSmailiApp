import { Body, Controller, Get, Post, UploadedFile, UseInterceptors, Param, HttpCode, HttpStatus } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiBadRequestResponse, ApiBearerAuth, ApiConsumes, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { diskStorage } from 'multer'

import { CommonService } from './common.service'
import { extname } from 'path'
import { Auth, GetUserId } from '../user/user.auth'


@ApiTags('Common')
@Controller('common')
export class CommonController {
  constructor(public readonly commonService: CommonService) {}

  // @Auth()
  // @ApiBearerAuth()
  // @Post('getIPFS')
  // @UseInterceptors(
  //   FileInterceptor('photo', {
  //     storage: diskStorage({
  //       destination: './uploads',
  //       filename: (req, file, callback) => {
  //         callback(null, Math.floor(100000 + Math.random() * 900000) + Date.now() + extname(file.originalname))
  //       },
  //     }),
  //     limits: { fileSize: 4048 * 4048 },
  //   })
  // )
  // async uploadImage(@UploadedFile() file: any, @Body() data: any, @GetUserId('id') userId: string) {
  //   return await this.commonService.getIPFS(file.filename, userId)
  // }

  @Post('getS3')
  @Auth()
  @ApiBearerAuth()
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          callback(null, Math.floor(100000 + Math.random() * 900000) + Date.now() + extname(file.originalname))
        },
      }),
      limits: { fileSize: 4048 * 4048 },
    })
  )
  async uploadImageToS3(@UploadedFile() file: any, @Body() data: any, @GetUserId('id') userId: string) {
    return await this.commonService.getS3Url(file.filename, userId)
  }

}