import { IsNumber, IsJWT } from "class-validator";
import { IntraUserDataDto } from "./intra-user-data.dto";

export class SignInResponse42Dto {
    @IsNumber()
    created: number;

    @IsJWT()
    accessToken: string;

    userData: IntraUserDataDto
}