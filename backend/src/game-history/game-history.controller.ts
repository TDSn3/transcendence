import { Controller, Post, Body } from '@nestjs/common';
import { GameHistoryService } from './game-history.service';
import { AddGameHistoryDto } from './dto/Dto';

@Controller('api/game-history')
export class GameHistoryController {
  constructor(private readonly gameHistoryService: GameHistoryService) {}

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
