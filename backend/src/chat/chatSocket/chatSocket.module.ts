/* eslint-disable */

import { Module } from "@nestjs/common";
import { ChatSocketGateway } from "./chatSocket.gateway";
import { PrismaService } from "../../prisma/prisma.service";
import { PrismaModule } from "nestjs-prisma";
import { ChannelsController } from "../channels/channels.controller";
import { ChannelMembersController } from "../channelMembers/channelMembers.controler";
import { ChannelsService } from "../channels/channels.service";
import { ChannelMembersService } from "../channelMembers/channelMembers.service";
import { MessagesService } from "../messages/messages.service";
import { AuthService } from '../../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { AuthTwoFAService } from "src/auth/2fa/2faService";
import { UsersService } from "src/users/users.service";

@Module({
	imports: [PrismaModule],
	controllers: [ChannelsController, ChannelMembersController],
	providers: [AuthService, JwtService, AuthTwoFAService, UsersService, ChannelsService, ChatSocketGateway, ChannelMembersService, MessagesService, PrismaService],
})

export class ChatSocketModule {}
