import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import User, { VerificationCodes } from './user.entity';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
  TypeOrmModule.forFeature([VerificationCodes,User,JwtService]),
  ConfigModule.forRoot({
    isGlobal: true,
  })],
  controllers: [UserController],
  providers: [UserService, JwtService],
  exports: [JwtService]
})
export class UserModule {}
