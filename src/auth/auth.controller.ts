import { Body, Controller, Get, Param, Post, Redirect, Render, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto, RegisterDto } from "./dto";
import { Response } from 'express';

@Controller('auth')
export class AuthController{
    constructor(private authService: AuthService) {}

    @Get('login/:message?')
    @Render('pages/auth/login')
    loginPage(@Param('message') message : string) : object {
        return { message };
    }

    @Get('register/:message?')
    @Render('Pages/Auth/register')
    regPage(@Param('message') message : string) : object {
        return { message };
    }

    @Post('login')
    async login(@Body() dto: LoginDto, @Res() res: Response){
        try{
            const token = await this.authService.login(dto);
            console.log(token);
            if (!token)
                return await res.redirect('/auth/login/TokenError');
            else
                await this.authService.setTokenCookies(token, res);
            return await res.redirect('/company');
        }
        catch(err){
            res.redirect(`login/${err.message}`)
        }
    }

    @Post('register')
    async register(@Body() dto: RegisterDto, @Res() res: Response){
        try{
            const token = await this.authService.register(dto);
            console.log(token);
            if (!token)
                return await res.redirect('/auth/register/User With That Email Exists');
            else
                await this.authService.setTokenCookies(token, res);
            return await res.redirect('/company');
        }
        catch(err){
            res.redirect(`register/${err.message}`)
        }
    }

    @Get('logout')
    @Redirect('/company')
    logout(@Res() res: Response){
        this.authService.logout(res);
    }
}