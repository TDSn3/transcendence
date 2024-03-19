import { Module } from "@nestjs/common";
import { PrismaModule, PrismaService } from "nestjs-prisma";
import { GamesService } from "./Game.service";

@Module({
	imports: [PrismaModule],
	providers: [GamesService, PrismaService],
})

export class GamesModule {}