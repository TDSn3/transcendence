import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GameHistory } from '@prisma/client';

@Injectable()
export class GameHistoryService {
  constructor(private readonly prisma: PrismaService) {}

  async addGameHistory(
    winningUserId: string,
    winningUserScore: number,
    losingUserId: string,
    losingUserScore: number,
  ): Promise<GameHistory> {
    try {
      const gameHistory = await this.prisma.gameHistory.create({
        data: {
          WinningUser: { connect: { id: winningUserId } },
          WinningUserScore: winningUserScore,
          LosingUser: { connect: { id: losingUserId } },
          LosingUserScore: losingUserScore,
        },
      });

      if (gameHistory) return gameHistory;

      throw new Error();
    } catch (error) {
      throw new UnprocessableEntityException('Failed to add a game history'); // HTTP 422 Unprocessable Entity
    }
  }
}
