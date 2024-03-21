import { IsEnum, IsString } from 'class-validator'
import { MatchStatusEnum } from './match.interface'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class CreateMatchDto {
  @ApiPropertyOptional({ description: 'The zodiac sign of the user.' })
  @IsString()
  toUser: string

  @ApiPropertyOptional({ description: 'The zodiac sign of the user.' })
  @IsEnum(MatchStatusEnum)
  status: MatchStatusEnum
}
