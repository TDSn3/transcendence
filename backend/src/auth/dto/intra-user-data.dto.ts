import { IsBoolean, IsEmail, IsNumber, IsString, IsUrl } from 'class-validator';

export class IntraUserDataDto {

    @IsBoolean()
    isTwoFactorEnabled: boolean;

    @IsNumber()
    intraId: number;

    @IsString()
    @IsEmail()
    emai42: string;

    @IsString()
    login: string;

    @IsString()
    firstName: string;

    @IsString()
    lastName: string;

    @IsString()
    @IsUrl()
    avatar: string;
}