import { CreatedModified } from '../../../helper'
import { Column, Entity, Index, PrimaryColumn, Unique } from 'typeorm'
import { MatchStatusEnum, MatchesInterface } from './match.interface'

@Entity()
export class Matches extends CreatedModified implements MatchesInterface {
  @PrimaryColumn()
  id: string

  @Column({ nullable: false })
  fromUser: string

  @Column({ nullable: false })
  toUser: string

  @Column({ default: MatchStatusEnum.pending })
  status: MatchStatusEnum
}
