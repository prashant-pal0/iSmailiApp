import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Users } from '../user/user.entity'
import { Matches } from './match.entity'
import { ConfigModule } from '@nestjs/config'
import { MatchController } from './match.controller'
import { MatchService } from './match.service'
import { UserModule } from '../user/user.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, Matches]),
    forwardRef(() => UserModule),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [MatchController],
  providers: [MatchService],
  exports: [],
})
export class MatchModule {}
