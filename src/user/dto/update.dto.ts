/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";

export class UpdateDto{
    @IsString()
    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    name: string;

    @IsPhoneNumber('BY')
    @IsNotEmpty()
    phoneNo: string;

    @IsNotEmpty()
    address: string;
}