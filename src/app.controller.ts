import { Controller, Get, Param, Post, Render, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly jwtService: JwtService) {}

  @Get()
  async getHello() : Promise<object> {
    return { title: 'Title', subtitle: 'Subtitle' };
  }

  // ПОЛУЧЕНИЕ ДАННЫХ ПОЛЬЗОВАТЕЛЯ
  @Post()
  async CurrentUser(@Req() request: Request){
      try{
        const accessToken = request.cookies.access_token;
        const decodedToken: any = this.jwtService.verify(accessToken);
        return decodedToken;  
      }
      catch (error) {
        console.log(error)
        return 'un';
      }
  }

  // СТРАНИЦА ОШИБОК
  @Get('errorPage/:status/:error')
  @Render('../views/pages/error')
  async errorPage(@Param() param: any){
    let message = param.error;
    if (message == 'Unauthorized')
      message = 'На эту страницу может зайти только авторизованный пользователь';
    if (message == 'Forbidden resource')
      message = 'У вас нет прав для получения ресурса'
    return await { status: param.status, message };
  }
}
