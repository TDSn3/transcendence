import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GameHistoryController } from './game-history.controller';
import { GameHistoryService } from './game-history.service';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { AuthTwoFAService } from "src/auth/2fa/2faService";
import { UsersService } from "src/users/users.service";

@Module({
  controllers: [GameHistoryController],
  providers: [AuthService, JwtService, AuthTwoFAService, UsersService, PrismaService, GameHistoryService],
})
export class GameHistoryModule {}
