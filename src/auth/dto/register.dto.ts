import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, Length } from "class-validator";

export class RegisterDto{
    @IsEmail({}, { message: 'Некорректный адрес электронной почты' })
    @IsNotEmpty({ message: 'Электронная почта не может быть пустой' })
    email: string;

    @IsString({ message: 'Пароль должен быть строкой' })
    @Length(3, 255, { message: 'Пароль должен содержать минимум 3 символа' })
    @IsNotEmpty({ message: 'Пароль не может быть пустым' })
    password: string;

    @IsNotEmpty({ message: 'Имя не может быть пустым' })
    name: string;

    @IsPhoneNumber('BY', { message: 'Некорректный номер телефона' })
    @IsNotEmpty({ message: 'Номер телефона не может быть пустым' })
    phoneNo: string;

    @IsNotEmpty({ message: 'Адрес не может быть пустым' })
    address: string;
}