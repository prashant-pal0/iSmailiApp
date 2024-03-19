import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UserModule } from './modules/user/user.module'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { dataSourceOptions } from './database/database.module'
import * as Joi from '@hapi/joi'
import { JwtModule } from '@nestjs/jwt'
import { MatchModule } from './modules/matches/match.module'
import { CommonModule } from './modules/common/common.module'
import { AuthGuard } from './modules/user/user.auth'
import { HttpModule } from '@nestjs/axios'

@Module({
  imports: [ 
       TypeOrmModule.forRoot(dataSourceOptions),


    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        TWILIO_ACCOUNT_SID: Joi.string().required(),
        TWILIO_AUTH_TOKEN: Joi.string().required(),
        TWILIO_VERIFICATION_SERVICE_SID: Joi.string().required(),
        // ...
      }),
    }),
    JwtModule.register({
      secret: 'mykeysecret', // Change this to your own secret key
      signOptions: { expiresIn: '1h' }, // Example expiration (1 hour)
    }),
    UserModule,
    CommonModule,
    MatchModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HttpModule,
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
