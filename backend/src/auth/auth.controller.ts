// auth.controller.ts
import { Controller, Post, Body, Get, Req, Res} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";



@Controller('api/auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('signup')
    signup(@Body() dto: AuthDto) {
        console.log(dto);
        return this.authService.signup(dto);
    }

    @Post('signin')
    signin(@Body() dto: AuthDto) {
        return this.authService.signin(dto);
    }

    @Get('signin42')
    async signin42(@Req() req: Request, @Res() res: Response) {
        try {
            const code = req.query.code as string;
            const state = req.query.state as string;
    
            // console.log('Code:', code);
            // console.log('State:', state);
    
            const accessToken = await this.authService.exchangeCodeForAccessToken(code);
            // console.log('Access Token:', accessToken);

            const userData = await this.authService.fetchDataWithAccessToken(accessToken);
            await this.authService.saveUserData(userData);
            res.json({ user_data: userData });
        } catch (error) {
            console.error('Erreur lors du traitement de la requête signin42:', error);
            res.status(500).json({ 
                status: 500,
                error: 'Internal Server Error' 
            });
        }
  }
}

