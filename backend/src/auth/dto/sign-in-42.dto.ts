import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class SignIn42Dto {
    @IsNotEmpty()
    code: string;

    @IsString()
    @IsOptional()
    otp?: string;

}