// auth.controller.ts
import { Controller, Post, Body, Get, Req, Res, Query} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Request, Response } from "express";
import { Cookie } from "express-cookies";
import { ApiTags } from "@nestjs/swagger";
import { SignIn42Dto } from "./dto/sign-in-42.dto";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { BadRequestException } from "@nestjs/common";
import { SignInResponse42Dto } from './dto/sign-in-response-42.dto.ts';
import { sign } from "crypto";

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
    async signin42Get(@Query() signIn42Dto: SignIn42Dto, @Res() res: Response) {
      try {

        const ft_token = await this.authService.exchangeCodeForFtToken(signIn42Dto.code);
  
        const userData = await this.authService.fetchDataWithFtToken(ft_token);
        console.log('userData:', userData.id);
        
        await this.authService.saveUserData(userData);

        const signInResponse: SignInResponse42Dto = await this.authService.handleUserSignIn(userData);

        // res.cookie('isLogin', 'true', { sameSite: 'None', secure: true });
        // res.status(200).json(signInResponse);
        console.log(signInResponse);
        res.redirect('http://localhost:3000/home');
      } catch (error) {
        res.status(500).json({ 
          status: 500,
          error: 'Error while processing signin42 request' 
        });
      }
    }

    @Get('logout')
    async logout(@Res() res: Response) {
      try {
        res.clearCookie('isLogin',  { sameSite: 'None', secure: true });
        console.log('Logout successful');
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

