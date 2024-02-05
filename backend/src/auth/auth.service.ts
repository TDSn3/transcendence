// auth.service.ts
import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from "./dto";
import * as argon from 'argon2';
import { Prisma } from "@prisma/client";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import axios from 'axios';


@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private configService: ConfigService
    ) {}

    async signup(dto: AuthDto) {
        // generate hash passwd
        const hash = await argon.hash(dto.password);

        // save the new user to the db
        try {
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    hash,         
                },
            });
    
            return this.signToken(user.id, user.email);
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError)
                if (error.code === 'P2002')
                    throw new ForbiddenException('This email is already in use');
                else
                    throw error;
        }
    }

    async signin(dto: AuthDto) {
        const user =
        await this.prisma.user.findUnique({
            where: {
            email: dto.email,
            },
        });
        if (!user)
        throw new ForbiddenException(
            'user does not exist',
        );

        const pwMatches = await argon.verify(
        user.hash,
        dto.password,
        );

        if (!pwMatches)
        throw new ForbiddenException(
            'incorrect password',
        );
        delete user.hash;
        return this.signToken(user.id, user.email);
    
    }

    async signToken(userId: number, email: string): Promise<{ access_token: string }> {
        const payload: {
            sub: number;
            email: string;
        } = {
            sub: userId,
            email,
        };
        const secret = this.configService.get('JWT_SECRET');
    
        const token = await this.jwtService.signAsync(payload, {
            expiresIn: '15m',
            secret: secret,
        });
    
        return {
            access_token: token
        };
    }

    async exchangeCodeForAccessToken(code: string): Promise<string> {
        const clientId = process.env.CLIENT_ID_42 as string;
        // console.log('clientId:', clientId);
        const clientSecret = process.env.CLIENT_SECRET_42 as string;
        // console.log('clientSecret:', clientSecret);
        const redirectUri = process.env.REDIRECTION_URI_42 as string;
        // console.log('redirectUri:', redirectUri);
        const tokenEndpoint = process.env.TOKEN_ENDPOINT_42 as string;

        const response = await axios.post(tokenEndpoint, {
            grant_type: 'authorization_code',
            client_id: clientId,
            client_secret: clientSecret,
            code: code,
            redirect_uri: redirectUri,
        });

        return response.data.access_token;
    }

    async fetchDataWithAccessToken(accessToken: string) {
        try {
            const apiEndpoint = 'https://api.intra.42.fr/v2';
            const response = await fetch(`${apiEndpoint}/me`, {
            headers: {
                method: 'GET',
                Authorization: `Bearer ${accessToken}`,
            },
            });

            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error with 42 API:', error);
            throw error;
        }
    }  
    
    async saveUserData(userData: any) : Promise<void>{
        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    email42: userData.email,
                },
            });

            if (user) {
                await this.prisma.user.update({
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
            } else {
                await this.prisma.user.create({
                    data: {
                        intraId: userData.id,
                        email42: userData.email,
                        login: userData.login,
                        firstName: userData.first_name,
                        lastName: userData.last_name,
                        avatar: userData.image.versions.small,
                    },
                });
            }
        } catch (error) {
            console.error('Error saving user data:', error);
            throw error;
        }
    }
}
