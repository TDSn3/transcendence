import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from '../prisma/prisma.service';
import { UsersStatusGateway } from './users.gateway';
import { PrismaModule } from 'nestjs-prisma';
import { forwardRef } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { AuthTwoFAService } from 'src/auth/2fa/2faService';

@Module({
  imports: [PrismaModule, forwardRef(() => AuthModule)],
  controllers: [UsersController],
  providers: [
    UsersService,
    PrismaService,
    UsersStatusGateway,
    AuthService,
    JwtService,
    AuthTwoFAService,
  ],
})
export class UsersModule {}
