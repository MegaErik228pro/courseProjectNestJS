import { IsIn, IsNotEmpty, IsString } from "class-validator";

export class StatusDto{
    @IsIn(['accept', 'way', 'finish', 'cancel'])
    @IsString()
    @IsNotEmpty()
    status: string;
}