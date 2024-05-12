import { BadRequestException, Controller, Get, Param, Post, Render, Req, Res, Session, UseGuards } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { CartService } from "./cart.service";
import { Request, Response } from 'express';
import { CompanyService } from "src/company/company.service";
import { JwtAuthGuard } from "src/auth/guard/jwt-auth-guard";
import { Roles } from "src/auth/guard/roles.decorator";
import { RolesGuard } from "src/auth/guard/role.guard";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

@Controller('cart')
export class CartController{
    constructor(private readonly cartService: CartService,
        private readonly jwtService: JwtService,
    ) {}
    
    @Post('add/:id')
    async addToCart(@Session() session: Record<string, any>, @Param('id') productId: string,  @Req() request: Request, @Res() response: Response) {
        if (!request.cookies.access_token)
            response.redirect('/auth/login');
        
        if (!session.cart) {
            session.cart = {};
        }
        const productService = new CompanyService();
        const product = await productService.getProduct(parseInt(productId));

        if (!product)
            throw new BadRequestException('Товара не существует');

        if (!session.cart[productId]) {
            session.cart[productId] = 1;
        }
        else {
            session.cart[productId]++;
        }

        const returnUrl = request.headers.referer || '/company';
        return response.redirect(returnUrl);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('user')
    @Post('remove/:id')
    async removeFromCart(@Session() session: Record<string, any>, @Param('id') productId: string,  @Req() request: Request, @Res() response: Response) {
        if (!session.cart) {
            session.cart = {};
        }
        const productService = new CompanyService();
        const product = await productService.getProduct(parseInt(productId));

        if (!product)
            throw new BadRequestException('Товара не существует');

        if (session.cart[productId]) {
            session.cart[productId]--;
        }
        if(session.cart[productId] <= 0){
            delete session.cart[productId];
        }

        if (Object.keys(session.cart).length === 0) {
            delete session.cart;
        }

        const returnUrl = request.headers.referer || '/company';
        return response.redirect(returnUrl);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('user')
    @Get()
    @Render('pages/cart')
    async getCart(@Session() session: Record<string, any>) {
        if (!session.cart) {
            return { cart: session.cart }
        }
        else
        {
            const cartObject: Record<string, any> = {};
            const productIds = Object.keys(session.cart);

            const productPromises = productIds.map(productId => {
                return prisma.product.findFirst({
                    where: {
                        IDProduct: Number(productId)
                    }
                });
            });

            const products = await Promise.all(productPromises);

            products.forEach((product, index) => {
                if (product) {
                    cartObject[productIds[index]] = {
                        ...product,
                        Count: session.cart[productIds[index]]
                    };
                }
            });
            console.log(cartObject);
            return { cart: cartObject };
        }
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('user')
    @Post('createOrder')
    async createOrder(@Session() session: Record<string, any>, @Res() response: Response) {
        const cartObject: Record<string, any> = {};
        const productIds = Object.keys(session.cart);

        const productPromises = productIds.map(productId => {
            return prisma.product.findFirst({
                where: {
                    IDProduct: Number(productId)
                }
            });
        });

        const products = await Promise.all(productPromises);

        products.forEach((product, index) => {
            if (product) {
                cartObject[productIds[index]] = {
                    ...product,
                    Count: session.cart[productIds[index]]
                };
            }
        });
        console.log(cartObject);
        return response.redirect('/user/MyOrders');
    }
}