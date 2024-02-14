// auth.service.ts
import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { Prisma, User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SignInResponse42Dto } from './dto/sign-in-response-42.dto';
import { SignIn42Dto } from './dto/sign-in-42.dto';
import axios from 'axios';
import { IntraUserDataDto } from './dto/intra-user-data.dto';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signin42(
    signIn42Dto: SignIn42Dto,
    res: Response,
  ): Promise<SignInResponse42Dto> {
    const ft_token = await this.exchangeCodeForFtToken(signIn42Dto.code);
    const userData = await this.fetchDataWithFtToken(ft_token);
    const user = await this.saveUserData(userData);

    // if (user.isTwoFactorEnabled) {}
    await this.generateToken(user.intraId, user.email42, user.login, res);
    const signInResponse: SignInResponse42Dto = user;
    console.log('signInResponse:', signInResponse);
    return signInResponse;
  }

  async exchangeCodeForFtToken(code: string): Promise<string> {
    const clientId = process.env.CLIENT_ID_42 as string;
    const clientSecret = process.env.CLIENT_SECRET_42 as string;
    const redirectUri = process.env.REDIRECTION_URI_42 as string;
    const tokenEndpoint = process.env.TOKEN_ENDPOINT_42 as string;

    const response = await axios.post(tokenEndpoint, {
      grant_type: 'authorization_code',
      client_id: clientId,
      client_secret: clientSecret,
      code: code,
      redirect_uri: redirectUri,
      approval_prompt: 'force',
    });

    return response.data.access_token;
  }

  async fetchDataWithFtToken(accessToken: string) {
    try {
      const apiEndpoint = 'https://api.intra.42.fr/v2';
      const response = await axios.get(`${apiEndpoint}/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.data) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const userData = await response.data;
      return userData;
    } catch (error) {
      console.error('Error with 42 API:', error);
      throw error;
    }
  }

  async saveUserData(userData: any): Promise<User> {
    try {
      const userAlreadyExist = await this.prisma.user.findUnique({
        where: {
          email42: userData.email,
        },
      });
      if (userAlreadyExist) {
        // throw new ForbiddenException('User already exists');
        const updateUser = await this.prisma.user.update({
          where: {
            email42: userData.email,
          },
          data: {
            intraId: userData.id,
            login: userData.login,
            firstName: userData.first_name,
            lastName: userData.last_name,
            avatar: userData.image.versions.small,
          },
        });
        return updateUser;
      } else {
        const newUser = await this.prisma.user.create({
          data: {
            intraId: userData.id,
            email42: userData.email,
            login: userData.login,
            firstName: userData.first_name,
            lastName: userData.last_name,
            avatar: userData.image.versions.small,
          },
        });
        return newUser;
      }
    } catch (error) {
      console.error('Error saving user data:', error);
      throw error;
    }
  }

  async generateToken(
    intraId: number,
    email: string,
    login: string,
    res: Response,
  ): Promise<SignInResponse42Dto> {
    try {
      const jwtToken = await this.signToken(intraId, email, login, true);
      console.log('jwtToken:', jwtToken);

      res.cookie('isLogin', jwtToken.JWTtoken, {
        httpOnly: false,
        secure: false,
        sameSite: 'strict',
      });

      const refreshToken = await this.signToken(intraId, email, login, false);
      console.log('refreshToken:', refreshToken);

      res.cookie('refreshToken', refreshToken.JWTtoken, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
      });

      // Note: You may want to return a response here or any additional data you need.
      // For example, you can return an object like { accessToken: jwtToken.JWTtoken, refreshToken: refreshToken.JWTtoken }
    } catch (error) {
      console.error('Error generating token:', error);
      throw error;
    }
  }

  async signToken(
    intraId: number,
    email42: string,
    login: string,
    jwtToken: boolean,
  ): Promise<{ JWTtoken: string }> {
    const payload = {
      sub: intraId,
      email42,
      login,
    };

    const secret = this.configService.get('JWT_SECRET');
    const refreshSecret = this.configService.get('JWT_REFRESH_SECRET');

    if (jwtToken) {
      const token = await this.jwtService.signAsync(payload, {
        expiresIn: '3m',
        secret: secret,
      });
      return { JWTtoken: token };
    } else {
      const token = await this.jwtService.signAsync(payload, {
        expiresIn: '15m',
        secret: refreshSecret,
      });
      return { JWTtoken: token };
    }
  }
}
