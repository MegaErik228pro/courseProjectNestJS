import { IsNotEmpty, IsString } from "class-validator";

export class OrderDto{
    @IsString()
    @IsNotEmpty()
    idUser: string;

    @IsString()
    @IsNotEmpty()
    idCompany: string;

    @IsString()
    @IsNotEmpty()
    orderDate: string;

    @IsString()
    @IsNotEmpty()
    status: string;

    @IsString()
    @IsNotEmpty()
    paymentMethod: string;

    @IsString()
    @IsNotEmpty()
    totalPrice: string;

    @IsString()
    @IsNotEmpty()
    products: string;
}