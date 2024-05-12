import { Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request, Response, NextFunction } from 'express';
import { ConfigService } from "@nestjs/config";

@Injectable()
export class TokenMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private config: ConfigService
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const accessToken = req.cookies.access_token;

    if (accessToken) {
      try {
        const payload = this.jwtService.verify(accessToken);
 
        req.user = payload;
        
        return next();
      } catch (error) {
        try {
          const refreshToken = req.cookies.refresh_token;

          if (!refreshToken) {
            throw new UnauthorizedException('Токен не найден');
          }

          const decodedRefreshToken: any = this.jwtService.decode(refreshToken);

        const payload = {
            sub: decodedRefreshToken.sub,
            email: decodedRefreshToken.email,
            role: decodedRefreshToken.role,
            key: decodedRefreshToken.key
        };
        const newAccessToken = await this.jwtService.signAsync(payload, {
            expiresIn: '30m',
            secret: this.config.get('JWT_SECRET'),
        });

        console.log({new_access_token: newAccessToken});

        res.clearCookie('access_token', { path: '/' });

        res.cookie('access_token', newAccessToken);

        req.user = decodedRefreshToken;

        return next();
        } catch (error) {
          if (error instanceof UnauthorizedException) {
            throw new UnauthorizedException('Refresh token не найден');
          }
          throw error;
        }
      }
    } else {
      throw new UnauthorizedException('На эту страницу может зайти только авторизованный пользователь');
    }
  }
}