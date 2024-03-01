import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from "./auth/auth.module";
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { SocketModule } from './game/socket.module';

@Module({
  imports: [AuthModule, ConfigModule.forRoot({
    isGlobal: true,
  }), UsersModule, PrismaModule, SocketModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
