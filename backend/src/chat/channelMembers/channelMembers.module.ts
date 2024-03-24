import { Module } from "@nestjs/common";
import { ChannelMembersController } from "./channelMembers.controler";
import { ChannelMembersService } from "./channelMembers.service";
import { PrismaService } from "../../prisma/prisma.service";
import { PrismaModule } from "nestjs-prisma";
import { ChannelsService } from "../channels/channels.service";
import { ChatSocketModule } from "../chatSocket/chatSocket.module";
import { MessagesService } from "../messages/messages.service";

@Module({
	imports: [ChatSocketModule, PrismaModule],
	controllers: [ChannelMembersController],
	providers: [ChannelMembersService, ChannelsService, MessagesService, PrismaService],
})

export class ChannelMembersModule {}
