import { Module } from "@nestjs/common";
import { ChannelsController } from "./channels.controller";
import { ChannelsService } from "./channels.service";
import { PrismaService } from "../../prisma/prisma.service";
import { PrismaModule } from "nestjs-prisma";
import { AuthService } from '../../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { AuthTwoFAService } from "src/auth/2fa/2faService";
import { UsersService } from "src/users/users.service";

@Module({
	imports: [PrismaModule],
	controllers: [ChannelsController],
	providers: [AuthService, JwtService, AuthTwoFAService, UsersService, ChannelsService, PrismaService],
})

export class ChannelsModule {}
