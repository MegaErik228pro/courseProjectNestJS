import { Controller, Param, Post, Req, Session } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { CartService } from "./cart.service";
import { Request } from 'express';
import { CompanyService } from "src/company/company.service";

@Controller('Cart')
export class CartController{
    constructor(private readonly cartService: CartService,
        private readonly jwtService: JwtService,
    ) {}
    
    @Post('add/:id')
    async addToCart(@Session() session: Record<string, any>, @Param('productId') productId: string,  @Req() request: Request) {
        const accessToken = request.cookies['access_token'];
        const decodedToken: any = this.jwtService.verify(accessToken);
        const userId = decodedToken.id; 

        console.log(userId);
        
        if (!session.cart) {
            session.cart = {};
        }
        const productService = new CompanyService();
        const product = await productService.getProduct(parseInt(productId));
        
        console.log(product);
        
        if (!session.cart[userId]) {
            session.cart[userId] = {};
        }

        if (!session.cart[userId][productId]) {
            session.cart[userId][productId] = 1;
        }
    }
}