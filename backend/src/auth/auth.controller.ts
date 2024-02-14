// auth.controller.ts
import { Controller, Post, Body, Get, Req, Res, Query, UseGuards, HttpCode, HttpStatus,} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Request, Response } from "express";
import { ApiTags } from "@nestjs/swagger";
import { SignIn42Dto } from "./dto/sign-in-42.dto";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { BadRequestException } from "@nestjs/common";
import { SignInResponse42Dto } from './dto/sign-in-response-42.dto.ts';
import { IntraUserDataDto } from "./dto/intra-user-data.dto";


@Controller('api/auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService
) {}

    @Get('signin42')
    async signin42(@Query() signIn42Dto: SignIn42Dto, @Res() res: Response){
      return this.authService
      .signin42(signIn42Dto, res)
      .then((user) => {
        res.status(200).json({
          message: 'User successfully signed in',
          user});
        }
      )
      .catch(() => {
				res.status(501).json({  message: 'Bruh...' });
			});
    }

    @Get('logout')
    async logout(@Res() res: Response) {
      try {
        // res.clearCookie('isLogin',  { sameSite: 'None', secure: true });
        // console.log('Logout successful');
        res.status(200).send('Logout successful');
      } catch (error) {
        console.error('Error during logout:', error);
        res.status(500).json({
          status: 500,
          error: 'Error during logout' 
        });
      }
    }
    
}

