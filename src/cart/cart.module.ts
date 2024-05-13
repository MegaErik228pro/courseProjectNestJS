import { Module } from "@nestjs/common";
import { CartController } from "./cart.controller";
import { CartService } from "./cart.service";
import { JwtModule } from "@nestjs/jwt";
import { options } from "src/auth/config";
import { OrderGateway } from 'src/socket/socket.gateway';

@Module({
    controllers:[CartController],
    providers:[CartService, OrderGateway],
    imports: [
        JwtModule.registerAsync(options()),
      ],
})
export class CartModule{}