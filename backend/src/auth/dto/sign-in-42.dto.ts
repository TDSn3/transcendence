import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SignIn42Dto {
  @IsNotEmpty()
  @IsString()
  code: string;

  @IsString()
  @IsOptional()
  otp?: string;
}
