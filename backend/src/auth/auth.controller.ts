import { Controller, Post, Body, Get, Req, Res, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { ApiTags, ApiBody } from '@nestjs/swagger';
import { SignIn42Dto } from './dto/sign-in-42.dto';
import { UsersService } from 'src/users/users.service';
import { AuthTwoFAService } from './2fa/2faService';
import { BadRequestException, HttpStatus } from '@nestjs/common';
import { Verify2FABody } from './interface/qrCode';
import { UseGuards } from '@nestjs/common';
import { AuthGuardToken } from 'src/auth/guard/jwt.guard';

@Controller('api/auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
    private readonly auth2FAService: AuthTwoFAService,
  ) {}

  @Get('signin42')
  async signin42(@Query() signIn42Dto: SignIn42Dto, @Res() res: Response) {
    try {
      const user = await this.authService.signin42(signIn42Dto, res);
      res.status(200).json({
        message: 'User successfully signed in',
        user,
      });
    } catch {
      res.status(501).json({ message: 'Bruh...' });
    }
  }

  @ApiBody({ type: SignIn42Dto })
  @Post('FakeUsers')
  async FakeUsers(@Res() res: Response) {
    try {
      const user = await this.authService.fakeUsers(res);
      res.status(200).json({
        message: 'User successfully signed in',
        user,
      });
    } catch {
      res.status(501).json({ message: 'Problem with FakeUser service' });
    }
  }

  // TODO: type userObject
  // @UseGuards(JwtGuard)
  @Post('logout')
  async logout(@Res() res: Response, @Body() userObject: any) {
    try {
      await this.authService.logout(res, userObject);
      res.status(200).send({
        message: 'User successfully logged out',
      });
    } catch {
      res.status(501).send({ message: 'Logout error' });
    }
  }
  // @UseGuards(AuthGuardToken)
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
  // @UseGuards(AuthGuardToken)
  @Get('UserByToken')
  async getUserByToken(@Req() req: Request, @Res() res: Response) {
    try {
      const user = await this.authService.getUserFromToken(req);
      res.status(200).json({
        user,
      });
    } catch {
      console.error('Error while getting user from token');
      res.status(401).json({ message: 'User not found' });
    }
  }

  @Post('verify-2fa')
  async verifyTwoFactorAuthenticationCode(
    @Body() body: Verify2FABody,
    @Res() res: Response,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const { code, user } = body;
      if (!user) throw new BadRequestException('User is required');

      const isSuccess =
        await this.authService.verifyTwoFactorAuthenticationCode(
          user,
          code,
          res,
        );
      if (isSuccess) return res.status(HttpStatus.OK).send('Code verified');
    } catch (error) {
      if (error.message === 'Invalid code') {
        return res.status(HttpStatus.BAD_REQUEST).send(error.message);
      }
      console.error(error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send('Error while verifying code');
    }
  }
  @UseGuards(AuthGuardToken)
  @Post('2fa')
  async handleTwoFactorAuth(
    @Body() body,
    @Res() res: Response,
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const { userData } = body;
      await this.auth2FAService.generateQRCode(userData.id, res);
    } catch (error) {
      console.error(error);
      return res.status(500).send('Error while handling 2FA');
    }
  }
}
