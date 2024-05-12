import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-jwt";
import { PrismaService } from "src/prisma/prisma.service";
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(config: ConfigService, private prisma: PrismaService){
        super({
            jwtFromRequest: (req : Request) => {
                let token = null;
                if (req && req.cookies) {
                    token = req.cookies.access_token;
                }
                return token;
            },
            ignoreExpiration: false,
            secretOrKey: config.get('JWT_SECRET'),
        })
    }

    async validate(payload: {sub: number, email: string, role: string}){
        if (payload.sub)
        {
            const user = await this.prisma.user.findUnique({
                where:{
                    IDUser: payload.sub,
                },
            });
            if (!user) {
                return null;
            }
            return user;
        };
    }
}