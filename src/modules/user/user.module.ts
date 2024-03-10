import { Module } from '@nestjs/common'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Users, VerificationCodes } from './user.entity'
import { ConfigModule } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, VerificationCodes]),
    ConfigModule.forRoot({
      isGlobal: true
    })
  ],
  controllers: [UserController],
  providers: [UserService, JwtService],
  exports: [JwtService]
})
export class UserModule {}
