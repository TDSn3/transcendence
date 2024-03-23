import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from '../prisma/prisma.service';
import { UsersStatusGatewayService } from './users.gateway.service';
import { UsersStatusGateway } from './users.gateway';
import { PrismaModule } from 'nestjs-prisma';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [
    PrismaService,
    UsersService,
    UsersStatusGateway,
    UsersStatusGatewayService,
  ],
  exports: [UsersStatusGatewayService],
})
export class UsersModule {}
