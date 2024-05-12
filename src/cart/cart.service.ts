import { Injectable } from "@nestjs/common";

@Injectable()
export class CartService{
    // constructor(@Session() private readonly session: Record<string, any>) {}
    
    // async addToCart(productId: string, jwtService: JwtService) {
    //     const accessToken = request.cookies['access_token'];
    //     const decodedToken: any = jwtService.verify(accessToken);
    //     const userId = decodedToken.id; 

    //     console.log(userId);
        
    //     if (!this.session.cart) {
    //         this.session.cart = {};
    //     }
    //     const productService = new CompanyService();
    //     const product = await productService.getProduct(parseInt(productId));
        
    //     console.log(product);
        
    //     if (!this.session.cart[userId]) {
    //         this.session.cart[userId] = {};
    //     }

    //     if (!this.session.cart[userId][productId]) {
    //         this.session.cart[userId][productId] = 1;
    //     }
    // }
}