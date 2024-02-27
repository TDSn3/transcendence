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
import { Request } from 'express';

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
    const signInResponse: SignInResponse42Dto = await this.generateToken(
      user.intraId,
      user.email42,
      user.login,
      user.firstName,
      user.lastName,
      user.avatar,
      res,
    );

    return signInResponse;
  }

  async FakeUsers(signIn42Dto: SignIn42Dto,
    res: Response,
  ): Promise<SignInResponse42Dto> {
    const fake = {
      id: 1,
      email: "bob@mail.com",
      login: "bob",
      first_name: "bobby",
      last_name: "fatass",
      image: {
        link: 'https://cdn.intra.42.fr/users/4eb155a3e26f47e520f51167907735e4/wnaseeve.jpg',
        versions: {
          large: 'https://cdn.intra.42.fr/users/dde92386d6828a531ed1f28735d9d732/large_wnaseeve.jpg',
          medium: 'https://cdn.intra.42.fr/users/e8f1ca3c64e0ca7eb1a2f56ad30b814b/medium_wnaseeve.jpg',
          small: 'https://cdn.intra.42.fr/users/bcb8d9431fa02476618e6f25ff61ec64/small_wnaseeve.jpg',
          micro: 'https://cdn.intra.42.fr/users/fb9cedc9ab2c1601d41799dcf4160120/micro_wnaseeve.jpg'
        }
      }
    }

    const user1 = await this.saveUserData(fake);
    
    const signInResponse: SignInResponse42Dto = await this.generateToken(
      user1.intraId,
      user1.email42,
      user1.login,
      user1.firstName,
      user1.lastName,
      user1.avatar,
      res,
    );
    // console.log('signInResponse: ', signInResponse);
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
          withCredentials: true,
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
            status: 'ONLINE',
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
    firstName: string,
    lastName: string,
    avatar: string,
    res: Response,
  ): Promise<SignInResponse42Dto> {
    try {
      const jwtToken = await this.signToken(intraId, email, login, true);
      // console.log('jwtToken:', jwtToken);

      res.cookie('isLogin', jwtToken.JWTtoken, {
        httpOnly: false,
        secure: false,
        sameSite: 'strict',
      });

      const signInResponse: SignInResponse42Dto = {
        created: Date.now(),
        accessToken: jwtToken.JWTtoken,
        userData: {
          TwoFactorAuthSecret: '',
          isTwoFactorEnabled: false,
          intraId: intraId,
          email42: email,
          login: login,
          firstName: firstName,
          lastName: lastName,
          avatar: avatar,
        },
      };

      return signInResponse;
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
    // const refreshSecret = this.configService.get('JWT_REFRESH_SECRET');

    if (jwtToken) {
      const token = await this.jwtService.signAsync(payload, {
        expiresIn: '3m',
        secret: secret,
      });
      return { JWTtoken: token };
    } else {
      const token = await this.jwtService.signAsync(payload, {
        expiresIn: '15m',
        secret: secret,
      });
      return { JWTtoken: token };
    }
  }

  async logout(res: Response, logOutUser?: any) {
    try {
      res.clearCookie('isLogin', {
        httpOnly: false,
        secure: false,
        sameSite: 'strict',
      });

      if (logOutUser) {
        const user1 = await this.prisma.user.update({
          where: {
            email42: logOutUser.user.userData.email42,
          },
          data: {
            status: 'OFFLINE',
          },
        });
        console.log('StatusUser:', user1);
      }
    } catch (error) {
      throw "Problem with logout";
    }
  }

  async checksession(req: Request) {
    const token = req.cookies['isLogin'];
    // console.log('token:', token);

    if (!token) throw new ForbiddenException('No token found');
  }
}
