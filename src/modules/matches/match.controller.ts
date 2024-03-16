// match.controller.ts
import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { CreateMatchDto } from './match.dto';
import { MatchService } from './match.service';
import { Matches } from './match.entity';
import { GetUserId } from '../user/user.auth';

@Controller('matches')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Post('/addMatch')
  async addMatch(
    @GetUserId('id') userId: string,
    @Body() createMatchDto: CreateMatchDto,
  ) {
    return this.matchService.addMatch(userId,createMatchDto);
  }
}
