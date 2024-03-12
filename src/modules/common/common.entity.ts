import { Column, Entity, Index, PrimaryColumn, Unique } from 'typeorm'
import {
  IPFSlistInterface,
  S3FileInterface

} from './common.interface'
import { CreatedModified } from 'helper'

@Entity()
export class IPFSlist extends CreatedModified implements IPFSlistInterface {
  @PrimaryColumn()
  id: string

  @Column()
  userId: string

  @Column()
  ipfs: string
}

@Entity()
export class S3List extends CreatedModified implements S3FileInterface {
  @PrimaryColumn()
  id: string

  @Column({ nullable: true })
  userId: string

  @Column({ nullable: true })
  s3link: string
}

