import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { CompanyModule } from './company/company.module';
import { CartModule } from './cart/cart.module';
import { CartController } from './cart/cart.controller';
import { CartService } from './cart/cart.service';
import { JwtModule } from '@nestjs/jwt';
import { options } from './auth/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TokenMiddleware } from './middleware/tokenMIddleware';
import { UserController } from './user/user.controller';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  }), ServeStaticModule.forRoot({
    rootPath: 'C:\\Users\\Erik\\Desktop\\3course\\DeliveryHub\\delivery\\wwwroot',
  }), AuthModule, UserModule, PrismaModule, CompanyModule, CartModule, JwtModule.registerAsync(options())],
  controllers: [AppController, CartController],
  providers: [AppService, CartService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TokenMiddleware)
      .forRoutes(
        UserController,
        { path: 'company/*', method: RequestMethod.POST }
      );
  }
}
