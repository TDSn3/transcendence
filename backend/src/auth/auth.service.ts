import axios from 'axios';
import {
  Injectable,
  ForbiddenException,
  UnprocessableEntityException,
  BadGatewayException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, UserStatus } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SignInResponse42Dto } from './dto/sign-in-response-42.dto.ts';
import { SignIn42Dto } from './dto/sign-in-42.dto';
import { Response } from 'express';
import { Request } from 'express';
import * as cookie from 'cookie';
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

  async signIn42(signIn42Dto: SignIn42Dto, res: Response) {
    try {
      const ft_token = await this.exchangeCodeForFtToken(signIn42Dto.code);
      const userData = await this.fetchDataWithFtToken(ft_token);

      const userFormatted = {
        intraId: userData.id,
        email42: userData.email,
        login: userData.login,
        firstName: userData.first_name,
        lastName: userData.last_name,
        avatar: userData.image.versions.medium,
      };
      const user = await this.saveUserData(userFormatted);
      const tokens = await this.generateToken(user);

      if (!user.isTwoFactorAuthEnabled) this.setCookies(res, tokens.token, tokens.refreshToken);

      const userGoodData = { ...user, accessToken: tokens.token };

      return userGoodData;
    } catch (error) {
      throw new UnprocessableEntityException('Failed to sign in with 42 authenticator'); // HTTP 422 Unprocessable Entity 
    }
  }

  async fakeUsers(res: Response) {
    try {
      const fake = {
        id: 'FakeUser',
        intraId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        email42: 'dummy@mail.com',
        login: 'dummy',
        firstName: 'John',
        lastName: 'Doe',
        avatar: 'https://cdn.intra.42.fr/users/small_dummy.jpg',
        isTwoFactorAuthEnabled: false,
        twoFactorAuthSecret: null,
        wins: 0,
        status: UserStatus.ONLINE,
        losses: 0,
      };

      const user = await this.saveUserData(fake);

      const tokens = await this.generateToken(user);
      this.setCookies(res, tokens.token, tokens.refreshToken);

      const userGoodData = {
        ...user,
        twoFactorAuthSecret: '',
        isTwoFactorAuthEnabled: false,
        accessToken: tokens.token,
      };

      return userGoodData;
    } catch (error) {
      throw new UnprocessableEntityException('Failed to sign in with fake user'); // HTTP 422 Unprocessable Entity
    }
  }

  async exchangeCodeForFtToken(code: string): Promise<string> {
    try {
      const clientId = process.env.API_42_UID as string;
      const clientSecret = process.env.API_42_SECRET as string;
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
    } catch (error) {
      throw new UnprocessableEntityException('Failed to post to tokenEndpoint'); // HTTP 422 Unprocessable Entity
    }
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

      if (response.data) return response.data;
      throw new Error();
    } catch (error) {
      throw new BadGatewayException('Error with 42 api'); // HTTP 502 Bad Gateway
    }
  }

  async saveUserData(userData: any): Promise<User> {
    try {
      const userAlreadyExist = await this.prisma.user.findUnique({
        where: { email42: userData.email42 },
      });

      if (userAlreadyExist) {
        const updateUser = await this.prisma.user.update({
          where: { id: userAlreadyExist.id },
          include: {
            friends: true,
            friendOf: true,
            historyGamesWon: { include: { WinningUser: true, LosingUser: true } },
            historyGamesLost: { include: { WinningUser: true, LosingUser: true } },
          },
          data: { status: UserStatus.ONLINE },
        });

        if (updateUser) return updateUser;
        throw new Error();
      } else {
        const newUser = await this.prisma.user.create({
          data: {
            intraId: userData.intraId,
            email42: userData.email42,
            login: userData.login,
            firstName: userData.firstName,
            lastName: userData.lastName,
            avatar: userData.avatar,
          },
          include: {
            friends: true,
            friendOf: true,
            historyGamesWon: { include: { WinningUser: true, LosingUser: true } },
            historyGamesLost: { include: { WinningUser: true, LosingUser: true } },
          },
        });

        if (newUser) return newUser;
        throw new Error();
      }
    } catch (error) {
      throw new UnprocessableEntityException('Error saving user data'); // HTTP 422 Unprocessable Entity
    }
  }

  setCookies(res: Response, token: string, refreshToken: string) {
    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
    });
  }

  async generateToken(user: User): Promise<{ token: string, refreshToken: string }> {
    try {
      const token = await this.jwtService.signAsync(
        {
          intraId: user.intraId,
          email42: user.email42,
          login: user.login,
          id: user.id,
        },
        {
          expiresIn: '1d',
          secret: this.configService.get('JWT_SECRET'),
        },
      );
 
      const refreshToken = await this.jwtService.signAsync(
        {
          intraId: user.intraId,
          email42: user.email42,
          login: user.login,
          id: user.id,
        },
        {
          expiresIn: '7d',
          secret: this.configService.get('JWT_REFRESH_SECRET'),
        },
      );

      return { refreshToken, token };
    } catch (error) {
      throw new UnprocessableEntityException('Error generating token'); // HTTP 422 Unprocessable Entity
    }
  }

  async logout(res: Response, userObject: any) {
    try {
      res.clearCookie('token', {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
      });

      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
      });

      if (userObject && userObject.user.id) {
        await this.prisma.user.update({
          where: { id: userObject.user.id },
          data: { status: UserStatus.OFFLINE },
        });
      }
      throw new Error();
    } catch (error) {
      throw new UnprocessableEntityException('Error with logout'); // HTTP 422 Unprocessable Entity
    }
  }

  async checksession(req: Request): Promise<SignInResponse42Dto> {
    try {
      const token = req.cookies['isLogin'];

      if (!token) throw new ForbiddenException('No token found');

      const decoded = this.jwtService.verify(token);
      console.log('decoded:', decoded);

      const user = await this.prisma.user.findUnique({
        where: {
          email42: decoded.email42,
        },
      });

      if (!user) throw new NotFoundException('User not found');

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
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw new NotFoundException(error.message); // HTTP 404 Not Found
      if (error instanceof ForbiddenException) throw new ForbiddenException(error.message); // HTTP 403 Forbidden
      throw new UnprocessableEntityException('Error with logout'); // HTTP 422 Unprocessable Entity
    }
  }

  async getUserByToken(req: Request): Promise<User> {
    try {
      const cookies = cookie.parse(req.headers.cookie || '');
      const token = cookies?.token;
      const refreshToken = cookies?.refreshToken;

      if (!token) throw new Error();

      const decoded = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const user = await this.userService.findById(decoded.id);

      return user;
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw new NotFoundException(error.message); // HTTP 404 Not Found
      throw new UnprocessableEntityException('Error with getUserByToken'); // HTTP 422 Unprocessable Entity
    }
  }

  async verifyTwoFactorAuthenticationCode(
    user: User,
    code: string,
    res: Response,
  ): Promise<boolean> {
    try {
      const isCodeValid = await this.auth2FAService.isTwoFactorAuthenticationCodeValid(
        code,
        user,
      );

      if (!isCodeValid) throw new Error();

      const tokens = await this.generateToken(user);
      this.setCookies(res, tokens.token, tokens.refreshToken);
      return true;
    } catch (error) {
      throw new UnprocessableEntityException('Error with verifyTwoFactorAuthenticationCode'); // HTTP 422 Unprocessable Entity
    }
  }
}
