import { Module } from '@nestjs/common'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Users, VerificationCodes } from './user.entity'
import { ConfigModule } from '@nestjs/config'
import { JwtModule, JwtService } from '@nestjs/jwt'

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, VerificationCodes]),
    ConfigModule.forRoot({
      isGlobal: true
    }),
    JwtModule.register({
      secret: 'secretsign', // Replace with your actual JWT secret
      signOptions: { expiresIn: '1h' } // Adjust expiration as needed
    })
  ],
  controllers: [UserController],
  providers: [UserService, JwtService],
  exports: [JwtService]
})
export class UserModule {}
