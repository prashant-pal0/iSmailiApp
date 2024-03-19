import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CommonController } from './common.controller'
import { CommonService } from './common.service'
import { Users } from '../user/user.entity'
import { UserModule } from '../user/user.module'
import { IPFSlist, S3List } from './common.entity'
import { UserService } from '../user/user.service'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, IPFSlist, S3List, ]),
    forwardRef(() => UserModule),
    ConfigModule.forRoot({
      isGlobal: true,
    })
  ],
  controllers: [CommonController],
  providers: [CommonService],
  exports: [CommonService],
})
export class CommonModule {}
