import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from '../prisma/prisma.service';
import { UsersStatusGateway } from './users.gateway';
import { PrismaModule } from 'nestjs-prisma';

@Module({
	imports: [PrismaModule],
	controllers: [UsersController],
	providers: [UsersService, PrismaService, UsersStatusGateway],
})
export class UsersModule {}
