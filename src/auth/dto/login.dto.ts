import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginDto{
    @IsEmail({}, { message: 'Некорректный адрес электронной почты' })
    @IsNotEmpty({ message: 'Адрес электронной почты не может быть пустым' })
    email: string;

    @IsString({ message: 'Пароль должен быть строкой' })
    @IsNotEmpty({ message: 'Пароль не может быть пустым' })
    password: string;
}

