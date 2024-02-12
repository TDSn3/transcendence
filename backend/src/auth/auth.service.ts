// auth.service.ts
import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from "./dto";
import * as argon from 'argon2';
import { Prisma } from "@prisma/client";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { SignInResponse42Dto } from "./dto/sign-in-response-42.dto";
import axios from 'axios';


@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private configService: ConfigService
    ) {}

    async signin42(code:string, state: string, otp: string): Promise<SignInResponse42Dto> {

        const ft_token = await this.exchangeCodeForFtToken(code);
        const userData = await this.fetchDataWithFtToken(ft_token);
        await this.saveUserData(userData);
        const signInResponse: SignInResponse42Dto = await this.handleUserSignIn(userData);

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
            const response = await fetch(`${apiEndpoint}/me`, {
            headers: {
                method: 'GET',
                Authorization: `Bearer ${accessToken}`,
            },
            });

            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }

            const userData = await response.json();
            return userData;
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

    async handleUserSignIn(userData: any): Promise<SignInResponse42Dto> {
        try {

            const jwtToken = await this.TokenIdentifier(userData.intraId);
    
            return {
                created: 1,
                access_token: jwtToken,
                data: {
                    intraId: userData.id,
                    email42: userData.email,
                    login: userData.login,
                    firstName: userData.first_name,
                    lastName: userData.last_name,
                    avatar: userData.image.versions.small,
                },
            };
        } catch (error) {
            console.error('Error handling user token assignment:', error);
            throw error;
        }
    }
    
    async TokenIdentifier(intraId: number): Promise<string> {
        const payload = {
            sub: intraId,
        };
        const secret = this.configService.get('JWT_SECRET');
    
        const token = await this.jwtService.signAsync(payload, {
            expiresIn: '15m',
            secret: secret,
        });
    
        return token;
    }
}
