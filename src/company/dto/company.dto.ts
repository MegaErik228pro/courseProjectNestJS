import { IsNotEmpty, IsString } from "class-validator";

export class CompanyDto{
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    path: string;
}