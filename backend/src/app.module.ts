import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from "./auth/auth.module";
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { ChannelsModule } from './chat/channels/channels.module';
import { ChannelMembersModule } from './chat/channelMembers/channelMembers.module';

@Module({
  imports: [AuthModule, ConfigModule.forRoot({
    isGlobal: true,
  }), UsersModule, ChannelsModule, ChannelMembersModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
