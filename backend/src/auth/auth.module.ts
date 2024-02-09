import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from 'nestjs-prisma';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/';
import { PassportModule } from '@nestjs/passport';

@Module({
    imports: [
        PrismaModule, 
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '3m' },
    })],
    controllers: [AuthController],
    providers: [AuthService, PrismaService, JwtStrategy],
})
export class AuthModule {}