import { Module } from "@nestjs/common";
import { ChatSocketGateway } from "./chatSocket.gateway";
import { PrismaService } from "../../prisma/prisma.service";
import { PrismaModule } from "nestjs-prisma";

@Module({
	imports: [PrismaModule],
	providers: [ChatSocketGateway, PrismaService],
})

export class ChatSocketModule {}
