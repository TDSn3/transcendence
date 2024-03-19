import { Module } from "@nestjs/common";
import { GameGateway } from "./GameGateway";
import { PrismaModule } from "nestjs-prisma";
import { GamesService } from "./Pong/Game.service";

@Module({
	imports: [PrismaModule],
	providers: [/*SocketEvents*/ GamesService, GameGateway]
})
export class SocketModule{}