import { Module } from "@nestjs/common";
import { ChannelsController } from "./channels.controller";
import { ChannelsService } from "./channels.service";
import { PrismaService } from "../../prisma/prisma.service";
import { PrismaModule } from "nestjs-prisma";
import { ChannelMembersService } from "../channelMembers/channelMembers.service";

@Module({
	imports: [PrismaModule],
	controllers: [ChannelsController],
	providers: [ChannelsService, PrismaService],
})

export class ChannelsModule {}
