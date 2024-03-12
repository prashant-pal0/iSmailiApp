import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CommonController } from './common.controller'
import { CommonService } from './common.service'
import { IPFSlist, S3List } from './common.entity'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    TypeOrmModule.forFeature([ IPFSlist, S3List ]),
    ConfigModule.forRoot({
      isGlobal: true
    }),
  ],
  controllers: [CommonController],
  providers: [CommonService],
  exports: [CommonService],
})
export class CommonModule {}
