import { IsNotEmpty, IsString } from "class-validator";

export class OrderDto{
    @IsString()
    @IsNotEmpty()
    paymentMethod: string;

    @IsString()
    @IsNotEmpty()
    totalPrice: string;
}