import { Module } from "@nestjs/common";
import { ChannelMembersController } from "./channelMembers.controler";
import { ChannelMembersService } from "./channelMembers.service";
import { PrismaService } from "../../prisma/prisma.service";
import { PrismaModule } from "nestjs-prisma";
import { ChannelsService } from "../channels/channels.service";
import { ChatSocketModule } from "../chatSocket/chatSocket.module";
import { MessagesService } from "../messages/messages.service";
import { AuthService } from "src/auth/auth.service";
import { JwtService } from '@nestjs/jwt';
import { AuthTwoFAService } from "src/auth/2fa/2faService";
import { UsersService } from "src/users/users.service";

@Module({
	imports: [ChatSocketModule, PrismaModule],
	controllers: [ChannelMembersController],
	providers: [AuthService, JwtService, AuthTwoFAService, UsersService, ChannelMembersService, ChannelsService, MessagesService, PrismaService],
})

export class ChannelMembersModule {}
