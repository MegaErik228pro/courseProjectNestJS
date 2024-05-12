import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { STRATEGIES } from "./strategies";
import { GUARDS } from "./guard";
import { PrismaModule } from "src/prisma/prisma.module";
import { UserModule } from "src/user/user.module";
import { PassportModule } from "@nestjs/passport";
import { ConfigModule } from "@nestjs/config";

@Module({
    imports: [PrismaModule, UserModule, PassportModule, ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: './../../env',
    }), JwtModule.register({})],
    controllers: [AuthController],
    providers: [AuthService, JwtService, ...STRATEGIES, ...GUARDS],
    exports: [AuthService, JwtService],
})
export class AuthModule{
    
}