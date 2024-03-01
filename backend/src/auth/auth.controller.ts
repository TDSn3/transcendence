// auth.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  Res,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { GetUser } from './decorator/get-user.decorator';
import { Request, Response } from 'express';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { SignIn42Dto } from './dto/sign-in-42.dto';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException } from '@nestjs/common';
import { SignInResponse42Dto } from './dto/sign-in-response-42.dto.ts';
import { IntraUserDataDto } from './dto/intra-user-data.dto';
import { JwtGuard } from './guard/jwt.guard';

@Controller('api/auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  @Get('signin42')
  async signin42(@Query() signIn42Dto: SignIn42Dto, @Res() res: Response) {
    return this.authService
      .signin42(signIn42Dto, res)
      .then((user) => {
        res.status(200).json({
          message: 'User successfully signed in',
          user,
        });
      })
      .catch(() => {
        res.status(501).json({ message: 'Bruh...' });
      });
  }
  @ApiBody({ type: SignIn42Dto })
  @Post('FakeUsers')
  async FakeUsers(@Body() signIn42Dto: SignIn42Dto, @Res() res: Response) {
    return this.authService
      .FakeUsers(signIn42Dto, res)
      .then((user) => {
        res.status(200).json({
          message: 'User successfully signed in',
          user,
        });
      })
      .catch(() => {
        res.status(501).json({ message: 'Problem with FakeUser service'});
      });
  }

  // @UseGuards(JwtGuard)
  @Post('logout')
  async logout(@Res() res: Response, @Body() user: string) {
    return this.authService
      .logout(res, user)
      .then(() => {
        res.status(200).send({
          message: 'User successfully logged out' });
      })
      .catch(() => {
        res.status(501).send({ message: 'Logout doesnt work...' });
      });
  }

  @Get('me')
  async checksession(@Req() req: Request, @Res() res: Response) {
    try {
      const userData = await this.authService.checksession(req);
      res.status(200).json({
        message: 'User is logged in',
        user: userData,
      });
    } catch (error) {
      res.status(501).json({ message: 'User is not logged in' });
    }
  }
  
}
