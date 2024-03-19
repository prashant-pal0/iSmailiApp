// match.service.ts
import { BadRequestException, Logger, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Matches } from './match.entity'
import { CreateMatchDto } from './match.dto'
import { Users } from '../user/user.entity'
import { errors } from 'src/error'
import { getUserBy } from '../user/user.repository'
import { MatchStatusEnum, MatchesInterface } from './match.interface'
import { uuid } from 'uuidv4'

@Injectable()
export class MatchService {
  logger: Logger

  constructor(
    @InjectRepository(Matches)
    private readonly matchesRepository: Repository<Matches>,
    @InjectRepository(Users)
    public readonly userRepository: Repository<Users>
  ) {}

  async addMatch(userId: string, createMatchDto: CreateMatchDto): Promise<any> {
    try {
      const userDetails = await getUserBy({ id: createMatchDto.toUser })
      if (!userDetails) throw errors.UserNotFound

      const obj: MatchesInterface = {
        id: uuid(),
        fromUser: userId,
        toUser: createMatchDto.toUser,
        status: createMatchDto.status,
      }

      await this.matchesRepository.insert(obj)
      return {
        message: 'Match sent successfully',
      }
    } catch (error) {
      this.logger.error(error.message)
      throw new BadRequestException(error.message)
    }
  }
}
