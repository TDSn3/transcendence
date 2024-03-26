import { Controller, Post, Body } from '@nestjs/common';
import { GameHistoryService } from './game-history.service';
import { AddGameHistoryDto } from './dto/Dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuardToken } from 'src/auth/guard/jwt.guard';

@Controller('api/game-history')
export class GameHistoryController {
  constructor(private readonly gameHistoryService: GameHistoryService) {}

  @UseGuards(AuthGuardToken)
  @Post('add')
  addGameHistory(@Body() gameHistoryDto: AddGameHistoryDto) {
    return this.gameHistoryService.addGameHistory(
      gameHistoryDto.winningUserId,
      gameHistoryDto.winningUserScore,
      gameHistoryDto.losingUserId,
      gameHistoryDto.losingUserScore,
    );
  }
}
