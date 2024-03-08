import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from '../prisma/prisma.service';
import { UsersStatusGateway } from './users.gateway';
import { ChannelMembersService } from 'src/chat/channelMembers/channelMembers.service';
import { ChannelMembersController } from 'src/chat/channelMembers/channelMembers.controler';

@Module({
  controllers: [UsersController, ChannelMembersController],
  providers: [UsersService, ChannelMembersService, PrismaService, UsersStatusGateway],
})
export class UsersModule {}
