import axios from 'axios';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, UserStatus } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SignInResponse42Dto } from './dto/sign-in-response-42.dto.ts';
import { SignIn42Dto } from './dto/sign-in-42.dto';
import { Response } from 'express';
import { Request } from 'express';
import { NotFoundException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AuthTwoFAService } from './2fa/2faService';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private userService: UsersService,
    private readonly auth2FAService: AuthTwoFAService,
  ) {}

  // NOTE: typer la réponse
  async signin42(signIn42Dto: SignIn42Dto, res: Response) {
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

    const userGoodData = {
      ...user,
      accessToken: signInResponse.accessToken,
    };

    return userGoodData;
  }

  // NOTE: typer la réponse
  async fakeUsers(signIn42Dto: SignIn42Dto, res: Response) {
    const fake = {
      id: 1,
      email: 'dummy@mail.com',
      login: 'dummy',
      first_name: 'John',
      last_name: 'Doe',
      image: {
        link: '',
        versions: {
          large: '',
          medium: '',
          small: '',
          micro: '',
        },
      },
    };

    const user = await this.saveUserData(fake);

    const signInResponse: SignInResponse42Dto = await this.generateToken(
      user.intraId,
      user.email42,
      user.login,
      user.firstName,
      user.lastName,
      user.avatar,
      res,
    );

    const userGoodData = {
      ...user,
      twoFactorAuthSecret: '',
      isTwoFactorAuthEnabled: false,
      accessToken: signInResponse.accessToken,
    };

    return userGoodData;
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
        const updateUser = await this.prisma.user.update({
          where: {
            id: userAlreadyExist.id,
          },
          data: {
            status: UserStatus.ONLINE,
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
            avatar: userData.image.versions.medium,
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

    if (jwtToken) {
      const token = await this.jwtService.signAsync(payload, {
        expiresIn: '1d',
        secret: secret,
      });
      return { JWTtoken: token };
    } else {
      const token = await this.jwtService.signAsync(payload, {
        expiresIn: '1d',
        secret: secret,
      });
      return { JWTtoken: token };
    }
  }

  // TODO: type userObject
  async logout(res: Response, userObject: any) {
    try {
      res.clearCookie('isLogin', {
        httpOnly: false,
        secure: false,
        sameSite: 'strict',
      });

      if (userObject && userObject.user) {
        await this.prisma.user.update({
          where: {
            id: userObject.user.id,
          },
          data: {
            status: UserStatus.OFFLINE,
          },
        });
      } else {
        throw new Error('Bad body');
      }
    } catch (error) {
      console.error('Logout error:', error);
      throw new Error('Problem with logout');
    }
  }

  async checksession(req: Request): Promise<SignInResponse42Dto> {
    const token = req.cookies['isLogin'];

    if (!token) throw new ForbiddenException('No token found');

    const decoded = this.jwtService.verify(token);
    console.log('decoded:', decoded);

    const user = await this.prisma.user.findUnique({
      where: {
        email42: decoded.email42,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const userData: SignInResponse42Dto = {
      created: Date.now(),
      accessToken: token,
      userData: {
        TwoFactorAuthSecret: '',
        intraId: user.intraId,
        email42: user.email42,
        login: user.login,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
      },
    };

    return userData;
  }

  async verifyTwoFactorAuthenticationCode(
    user: User,
    code: string,
  ): Promise<boolean> {
    try {
      const isCodeValid =
        await this.auth2FAService.isTwoFactorAuthenticationCodeValid(
          code,
          user,
        );
      if (!isCodeValid) throw new Error('Invalid code');
      // ajouter token JWT
      return true;
    } catch (error) {
      console.error(error);
      throw new Error('Server error');
    }
  }
}
