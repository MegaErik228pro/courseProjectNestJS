import { Body, Controller, Get, Param, Post, Render, Res, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';
import { UserService } from './user.service';
import { RightsDto, StatusDto, UpdateDto } from './dto';
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
    @Get('me/:message?')
    @Render('pages/profile')
    async getMe(@GetUser() user: User, @Param('message') message : string) {
        return await this.userService.getMe(user, message);
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
    @Post('me')
    async updateMe(@GetUser() user: User, @Body() dto: UpdateDto,  @Res() res: Response){
        await this.userService.updateMe(user, dto)
        return await res.redirect('/user/me');
    }

    // ЗАКАЗЫ

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('user')
    @Get('myOrders')
    @Render('pages/order')
    async getMyOrders(@GetUser() user: User) {
        return await this.userService.getMyOrders(user);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Get('admin/orders')
    @Render('pages/order')
    async getAllOrders() {
        return await this.userService.getAllOrders();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('companyAdmin')
    @Get('companyAdmin/orders')
    @Render('pages/admin/order')
    async getCompanyOrders(@GetUser() user: User) {
        return await this.userService.getCompanyOrders(user);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('companyAdmin')
    @Post('companyAdmin/updateStatus/:id')
    async updateCompanyOrders(@Param('id') id : number, @Body() dto: StatusDto, @Res() res: Response) {
        await this.userService.updateStatus(dto, Number(id));
        return res.redirect('/user/companyAdmin/orders');
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('companyAdmin')
    @Post('companyAdmin/clearOrders')
    async clearCompanyOrders(@GetUser() user: User, @Res() res: Response) {
        await this.userService.clearOrders(user);
        return res.redirect('/user/companyAdmin/orders');
    }

    // ИСТОРИЯ

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Get('admin/history')
    @Render('pages/admin/history')
    async getHistory() {
        return await this.userService.getHistory();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('companyAdmin')
    @Get('companyAdmin/history')
    @Render('pages/admin/history')
    async getCompanyHistory(@GetUser() user: User) {
        return await this.userService.getCompanyHistory(user);
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
