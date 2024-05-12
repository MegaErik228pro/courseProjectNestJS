import { IsIn, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class RightsDto{

    @IsIn(['user', 'admin', 'companyAdmin'])
    @IsString()
    @IsNotEmpty()
    role: string;

    @IsOptional()
    @IsString()
    key: string;
}