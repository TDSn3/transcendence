import { IsBoolean, IsEmail, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';

export class IntraUserDataDto {

  @IsString()
  @IsOptional()
  TwoFactorAuthSecret?: string;

  @IsBoolean()
  @IsOptional()
  isTwoFactorEnabled?: boolean;

  @IsNumber()
  intraId?: number;

  @IsString()
  @IsEmail()
  email42: string;

  @IsString()
  login: string;

  @IsString()
  firstName?: string;

  @IsString()
  lastName?: string;

  @IsString()
  @IsUrl()
  avatar?: string;
}
