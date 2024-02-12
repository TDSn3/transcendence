// auth.controller.ts
import { Controller, Post, Body, Get, Req, Res, Query, UseGuards, HttpCode, HttpStatus,} from "@nestjs/common";
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
import { JwtAuthGuard } from './strategy/jwt.strategy'

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
    async signin42(@Query() signIn42Dto: SignIn42Dto, @Res() res: Response) {
      try {

        const ft_token = await this.authService.exchangeCodeForFtToken(signIn42Dto.code);
  
        const userData = await this.authService.fetchDataWithFtToken(ft_token);
        
        await this.authService.saveUserData(userData);

        const signInResponse: SignInResponse42Dto = await this.authService.handleUserSignIn(userData);

        res.status(200).json(signInResponse);
        console.log(signInResponse);
      } catch (error) {
        res.status(500).json({ 
          status: 500,
          error: 'Error while processing signin42 request' 
        });
      }
    }



    // @Post('signin42')
    // async signin42(@Body() intraSignInDto: SignIn42Dto): Promise<SignInResponse42Dto> {
    //     const { code, state, otp } = intraSignInDto;
    //     return this.authService.signin42(code, state, otp);
    // }

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

