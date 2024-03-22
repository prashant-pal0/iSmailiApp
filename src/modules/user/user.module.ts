import { Module } from '@nestjs/common'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserGeoLocation, Users, VerificationCodes } from './user.entity'
import { ConfigModule } from '@nestjs/config'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { CommonService } from '../common/common.service'
import { CommonModule } from '../common/common.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, VerificationCodes, UserGeoLocation]),
    CommonModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [UserController],
  providers: [UserService, JwtService],
  exports: [UserService, JwtService],
})
export class UserModule {}
