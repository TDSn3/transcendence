import { Module } from "@nestjs/common";
import { ChannelsController } from "./channels.controller";
import { ChannelsService } from "./channels.service";
import { PrismaService } from "../../prisma/prisma.service";
import { PrismaModule } from "nestjs-prisma";
import { JwtService } from '@nestjs/jwt';

@Module({
	imports: [PrismaModule],
	controllers: [ChannelsController],
	providers: [JwtService, ChannelsService, PrismaService],
})

export class ChannelsModule {}
