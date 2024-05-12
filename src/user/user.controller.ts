import { Body, Controller, Get, Param, Post, Render, Res, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';
import { UserService } from './user.service';
import { RightsDto, UpdateDto } from './dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth-guard';
import { RolesGuard } from 'src/auth/guard/role.guard';
import { Roles } from 'src/auth/guard/roles.decorator';
import { Response } from 'express';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    // МОЙ ПРОФИЛЬ

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin', 'user', 'companyAdmin')
    @Get('me')
    @Render('pages/profile')
    async getMe(@GetUser() user: User, @Param('message') message : string) {
        const usr = await this.userService.getMe(user);
        return { usr, message }
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin', 'user', 'companyAdmin')
    @Post('deleteMe')
    async deleteMe(@GetUser() user: User, @Res() res: Response){
        await this.userService.deleteMe(user);
        return await res.redirect('/auth/logout');
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin', 'user', 'companyAdmin')
    @Post('updateMe')
    async updateMe(@GetUser() user: User, @Body() dto: UpdateDto,  @Res() res: Response){
        await this.userService.updateMe(user, dto)
        return await res.redirect('/user/me');
    }

    // УПРАВЛЕНИЕ ПРОФИЛЯМИ

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Get('admin')
    @Render('pages/admin/accounts')
    async getAll(){
        return this.userService.getAll();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Post('admin/delete/:id')
    async delete(@Param('id') id : number, @Res() res: Response){
        await this.userService.delete(Number(id));
        return res.redirect('/user/admin');
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Post('admin/updateRights/:id')
    async updateRights(@Param('id') id : number, @Body() dto: RightsDto, @Res() res: Response){
        await this.userService.updateRights(dto, Number(id));
        return res.redirect('/user/admin');
    }
}
