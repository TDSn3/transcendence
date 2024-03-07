import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { ChannelsModule } from './chat/channels/channels.module';
import { ChannelMembersModule } from './chat/channelMembers/channelMembers.module';
import { ChatSocketModule } from './chat/chatSocket/chatSocket.module';
import { SocketModule } from './game/socket.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    // Global
    PrismaModule,

    AuthModule,
    UsersModule,
    ChannelsModule,
    ChannelMembersModule,
    ChatSocketModule,
    SocketModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
