import { IsEnum, IsString } from 'class-validator'
import { MatchStatusEnum } from './match.interface'

export class CreateMatchDto {
  @IsString()
  toUser: string

  @IsEnum(MatchStatusEnum)
  status: MatchStatusEnum
}
