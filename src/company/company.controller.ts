import { Body, Controller, ForbiddenException, Get, Param, Post, Query, Render, Res, Session, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';
import { CompanyService } from './company.service';
import { CategoryDto, CompanyDto, ProductDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth-guard';
import { RolesGuard } from 'src/auth/guard/role.guard';
import { Roles } from 'src/auth/guard/roles.decorator';
import { Response } from 'express';

@Controller('company')
export class CompanyController {
    constructor(private companyService: CompanyService, private readonly jwtService: JwtService) {}

    // ПОЛУЧЕНИЕ СТРАНИЦ

    @Get('/')
    @Render('pages/index')
    async getAll(@Query('company') company: string)
    {
        if (!company)
            return this.companyService.getAll();
        else
            return this.companyService.getAllSearch(company);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Get('admin')
    @Render('pages/admin/index')
    async getAllAdmin()
    {
        return this.companyService.getAll();
    }

    @Get(':id')
    async getCompany(@Param('id') id: number, @Session() session : any, @Res() res: Response, @Query('product') productSearch: string, @Query('allergen') allergenSearch: string)
    {
        try{
            if (!Number.isNaN(Number(id)))
            {
                if (!productSearch && !allergenSearch)
                {
                    const obj = await this.companyService.getCompany(Number(id), session);
                    return await res.render('pages/company', obj);
                }
                else if (productSearch && !allergenSearch)
                {
                    const obj = await this.companyService.getCompanySearchProduct(Number(id), productSearch, session);
                    return await res.render('pages/company', obj);
                }
                else if (!productSearch && allergenSearch)
                {
                    const obj = await this.companyService.getCompanySearchAllergen(Number(id), allergenSearch, session);
                    return await res.render('pages/company', obj);
                }
                else if (productSearch && allergenSearch)
                {
                    const obj = await this.companyService.getCompanySearchProductAndAllergen(Number(id), productSearch, allergenSearch, session);
                    return await res.render('pages/company', obj);
                }
                else
                {
                    return;
                }
            }
        }
        catch (err){
            throw err;
        }
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('companyAdmin')
    @Get(':id/admin')
    @Render('pages/admin/company')
    async getCompanyAdmin(@Param('id') id: number, @GetUser() user: User, @Session() session : any)
    {
        if (user.AdminKey == Number(id))
            return this.companyService.getCompany(Number(id), session);
        else
            throw new ForbiddenException('Вы администратор компании с индентификатором ' + user.AdminKey);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Get('admin/createCompany')
    @Render('pages/admin/createCompany')
    async getCreateAdmin()
    {
        return {};
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Get('admin/updateCompany/:id')
    @Render('pages/admin/updateCompany')
    async getUpdateAdmin(@Param('id') id: number, @Session() session : any)
    {
        return this.companyService.getCompany(Number(id), session);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('companyAdmin')
    @Get(':id/admin/createCategory')
    @Render('pages/admin/createCategory')
    async getCreateCategory()
    {
        return {};
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('companyAdmin')
    @Get(':id/admin/updateCategory/:idCategory')
    @Render('pages/admin/updateCategory')
    async getUpdateCategory(@Param('idCategory') id: number)
    {
        return this.companyService.getCategory(Number(id));
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('companyAdmin')
    @Get(':id/admin/:idCategory/createProduct')
    @Render('pages/admin/createProduct')
    async getCreateProduct(@Param() param: any)
    {
        return this.companyService.getCategoryCurrentAndAll(Number(param.id), Number(param.idCategory));
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('companyAdmin')
    @Get(':id/admin/:idCategory/updateProduct/:idProduct')
    @Render('pages/admin/updateProduct')
    async getUpdateProduct(@Param() param: any)
    {
        return this.companyService.getCategoryCurrentAndAllAndProduct(Number(param.id), Number(param.idCategory), Number(param.idProduct));
    }

    @Get(":id/getProduct/:productId")
    async getProductById(@Param() param: any){
        const product = await this.companyService.getProductDetails(Number(param.productId));
        return product;
    }

    // УПРАВЛЕНИЕ КОМПАНИЯМИ 
    
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Post('createCompany')
    async createCompany(@GetUser() user: User, @Body() dto: CompanyDto, @Res() res: Response)
    {
        await this.companyService.createCompany(dto);
        return res.redirect('/company/admin');
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Post('updateCompany/:id')
    async updateCompany(@Body() dto: CompanyDto, @Param('id') id: number, @Res() res: Response)
    {
        await this.companyService.updateCompany(Number(id), dto);
        return res.redirect('/company/admin');
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Post('admin/deleteCompany/:id')
    async deleteCompany(@Param('id') id: number, @Res() res: Response)
    {
        await this.companyService.deleteCompany(Number(id));
        return res.redirect('/company/admin');
    }

    // УПРАВЛЕНИЕ КАТЕГОРИЯМИ

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('companyAdmin')
    @Post(':id/admin/createCategory')
    async createCategory(@Param('id') id: number, @Body() dto: CategoryDto, @Res() res: Response)
    {
        await this.companyService.createCategory(Number(id), dto);
        return res.redirect('/company/' + String(id) + '/admin');
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('companyAdmin')
    @Post(':id/admin/updateCategory/:categoryId')
    async updateCategory(@Param() param: any, @Body() dto: CategoryDto, @Res() res: Response)
    {
        await this.companyService.updateCategory(Number(param.categoryId), dto);
        return res.redirect('/company/' + String(param.id) + '/admin');
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('companyAdmin')
    @Post(':id/admin/deleteCategory/:categoryId')
    async deleteCategory(@Param() param: any, @Res() res: Response)
    {
        await this.companyService.deleteCategory(Number(param.categoryId));
        return res.redirect('/company/' + String(param.id) + '/admin');
    }

    // УПРАВЛЕНИЕ ТОВАРАМИ

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('companyAdmin')
    @Post(':id/admin/:categoryId/createProduct')
    async createProduct(@Param() param: any, @Body() dto: ProductDto, @Res() res: Response)
    {
        await this.companyService.createProduct(Number(param.categoryId), dto);
        return res.redirect('/company/' + String(param.id) + '/admin');
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('companyAdmin')
    @Post(':id/admin/:categoryId/updateProduct/:productId')
    async updateProduct(@Param() param: any, @Body() dto: ProductDto, @Res() res: Response)
    {
        await this.companyService.updateProduct(Number(param.productId), dto);
        return res.redirect('/company/' + String(param.id) + '/admin');
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('companyAdmin')
    @Post(':id/admin/:categoryId/deleteProduct/:productId')
    async deleteProduct(@Param() param: any, @Res() res: Response)
    {
        await this.companyService.deleteProduct(Number(param.productId));
        return res.redirect('/company/' + String(param.id) + '/admin');
    }
}