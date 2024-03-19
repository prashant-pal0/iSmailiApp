import { Module } from '@nestjs/common'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Users, VerificationCodes } from './user.entity'
import { ConfigModule } from '@nestjs/config'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { AuthGuard } from './user.auth'
import { CommonModule } from '../common/common.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, VerificationCodes]),
    CommonModule,

  ],
  controllers: [UserController],
  providers: [UserService, JwtService,AuthGuard],
  exports: [UserService,JwtService,AuthGuard],
})
export class UserModule {}
