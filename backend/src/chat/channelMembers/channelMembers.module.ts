import { Module } from "@nestjs/common";
import { ChannelMembersController } from "./channelMembers.controler";
import { ChannelMembersService } from "./channelMembers.service";
import { PrismaService } from "../../prisma/prisma.service";
import { PrismaModule } from "nestjs-prisma";
import { ChannelsService } from "../channels/channels.service";

@Module({
	imports: [PrismaModule],
	controllers: [ChannelMembersController],
	providers: [ChannelMembersService, ChannelsService, PrismaService],
})

export class ChannelMembersModule {}
