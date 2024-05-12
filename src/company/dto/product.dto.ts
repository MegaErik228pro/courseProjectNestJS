import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class ProductDto{
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    path: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    @IsNotEmpty()
    price: string;

    @IsString()
    @IsNotEmpty()
    gram: string;

    @IsOptional()
    @IsString()
    allergens: string;

    @IsString()
    @IsNotEmpty()
    category: string;
}