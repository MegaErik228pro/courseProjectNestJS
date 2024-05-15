import { ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { LoginDto, RegisterDto } from "./dto";
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { Response } from 'express';

@Injectable({})
export class AuthService{
    constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService) {}
    async register(dto: RegisterDto){
        try{
            const hash = await argon.hash(dto.password);

            const user = await this.prisma.user.create({
                data:{
                    Name: dto.name,
                    PhoneNo: dto.phoneNo,
                    Address: dto.address,
                    Role: 'user',
                    Email: dto.email,
                    Password: hash,
                },
            });

            return this.signToken(user.IDUser, user.Email, user.Role, user.AdminKey);
        }
        catch(error){
            if (error instanceof PrismaClientKnownRequestError){
                if (error.code === "P2002"){
                    throw new ForbiddenException('Пользователь с данной почтой уже существует');
                }
            }
            else
                throw error;
        }
        
    }

    async login(dto: LoginDto){
        try{
            const user = await this.prisma.user.findUnique({
                where:{
                    Email: dto.email,
                },
            });

            if (!user) throw new ForbiddenException('Пользователь не найден');

            const pwMatches = await argon.verify(user.Password, dto.password);
            if (!pwMatches) throw new ForbiddenException('Неверный пароль');

            return await this.signToken(user.IDUser, user.Email, user.Role, user.AdminKey);
        }
        catch(error){
            throw error;
        }
    }

    async signToken(userId: number, email: string, role: string, key: number | null): Promise<{access_token: string, refresh_token: string}>{
        const payload = {
            sub: userId,
            email,
            role,
            key
        };
        const token = await this.jwt.signAsync(payload, {
            expiresIn: '30m',
            secret: this.config.get('JWT_SECRET'),
        });
        const refreshToken = await this.jwt.signAsync(payload, {
            expiresIn: '1w',
            secret: this.config.get('JWT_SECRET'),
        });
        return {
            access_token: token,
            refresh_token: refreshToken
        }
    }

    async setTokenCookies(token: any, res: Response) {
        if (!token) {
            throw new UnauthorizedException();
        }
        await res.cookie('access_token', token.access_token);
        await res.cookie('refresh_token', token.refresh_token);
    }

    async logout(res: Response, session: Record<string, any>) {
        await res.clearCookie('access_token', { path: '/' });
        await res.clearCookie('refresh_token', { path: '/' });
        session.cart = null;
    }
}