/* eslint-disable */

import { Module } from "@nestjs/common";
import { GameGateway } from "./GameGateway";
import { PrismaModule } from "nestjs-prisma";
import { GamesService } from "./Pong/Game.service";
import { UsersModule } from "../users/users.module";
import { GameHistoryModule } from "src/game-history/game-history.module";
import { GameHistoryService } from "src/game-history/game-history.service";

@Module({
	imports: [PrismaModule, UsersModule, GameHistoryModule],
	providers: [/*SocketEvents*/ GamesService, GameGateway, GameHistoryService]
})
export class GameSocketModule{}