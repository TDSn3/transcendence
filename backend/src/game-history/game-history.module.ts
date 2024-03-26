import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { GameHistoryController } from './game-history.controller';
import { GameHistoryService } from './game-history.service';

@Module({
  controllers: [GameHistoryController],
  providers: [JwtService, PrismaService, GameHistoryService],
})
export class GameHistoryModule {}
