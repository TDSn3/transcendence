import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GameHistoryController } from './game-history.controller';
import { GameHistoryService } from './game-history.service';

@Module({
  controllers: [GameHistoryController],
  providers: [PrismaService, GameHistoryService],
})
export class GameHistoryModule {}
