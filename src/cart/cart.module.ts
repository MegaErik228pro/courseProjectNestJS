import { Module } from "@nestjs/common";
import { CartController } from "./cart.controller";
import { CartService } from "./cart.service";
import { JwtModule } from "@nestjs/jwt";
import { options } from "src/auth/config";

@Module({
    controllers:[CartController],
    providers:[CartService],
    imports: [
        JwtModule.registerAsync(options()),
      ],
})
export class CartModule{}