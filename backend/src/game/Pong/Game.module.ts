import { Module } from "@nestjs/common";
import { PrismaModule, PrismaService } from "nestjs-prisma";
import { GamesService } from "./Game.service";
import { GameHistoryModule } from "src/game-history/game-history.module";

@Module({
imports: [PrismaModule, GameHistoryModule],
	providers: [GamesService, PrismaService],
})

export class GamesModule {}