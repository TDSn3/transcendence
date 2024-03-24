import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { JwtService } from '@nestjs/jwt';
import * as cookie from 'cookie';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuardToken implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies?.token;
    const refreshToken = cookies?.refreshToken;
    const secret = token
      ? this.config.get('JWT_SECRET')
      : this.config.get('JWT_REFRESH_SECRET');

    if (!token || !refreshToken || !secret) {
      console.log('No token or refreshToken or secret');
      throw new UnauthorizedException('Please provide a valid token');
    }

    try {
      await this.verifyToken(token, process.env.JWT_SECRET);

      // Token is valid, proceed with the request

      return true;
    } catch (error) {
      // If the token verification fails, attempt to verify and refresh using the refreshToken

      try {
        const decoded = await this.verifyToken(
          refreshToken,
          process.env.JWT_REFRESH_SECRET,
        );

        // Refresh token is valid, create a new token and set it in the response

        const { email42, id } = decoded;
        const newToken = await this.jwtService.signAsync(
          { email42, id },
          {
            expiresIn: '1d',
            secret: process.env.JWT_SECRET,
          },
        );
        res.cookie('token', newToken, {
          httpOnly: true,
          secure: false,
          sameSite: 'strict',
        });

        return true;
      } catch (refreshError) {
        throw new UnauthorizedException(
          refreshError.message || 'Session expired! Please sign in',
        );
      }
    }
  }

  private verifyToken(token: string, secret: string): Promise<any> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, secret, (err, decoded) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded);
        }
      });
    });
  }
}
