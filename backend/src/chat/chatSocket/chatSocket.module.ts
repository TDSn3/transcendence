import { Module } from "@nestjs/common";
import { ChatSocketGateway } from "./chatSocket.gateway";
import { PrismaService } from "../../prisma/prisma.service";
import { PrismaModule } from "nestjs-prisma";
import { ChannelsController } from "../channels/channels.controller";
import { ChannelMembersController } from "../channelMembers/channelMembers.controler";
import { MessagesController } from "../messages/messages.controller";
import { ChannelsService } from "../channels/channels.service";
import { ChannelMembersService } from "../channelMembers/channelMembers.service";
import { MessagesService } from "../messages/messages.service";

@Module({
	imports: [PrismaModule],
	controllers: [ChannelsController, ChannelMembersController, MessagesController],
	providers: [ChannelsService, ChatSocketGateway, ChannelMembersService, MessagesService, PrismaService],
})

export class ChatSocketModule {}
