import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as cookieParser from 'cookie-parser';
import { HttpExceptionFilter } from './filter/http-exception.filter';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const session = require('express-session');
import * as fs from 'fs';

const httpsOptions = {
  key: fs.readFileSync('./secrets/cert.key'),
  cert: fs.readFileSync('./secrets/cert.crt'),
};

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {httpsOptions});
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.use(cookieParser());
  app.setViewEngine('ejs');
  app.use(session({
    secret: 'SECRET',
    resave: false,
    saveUninitialized: true
  }));
  await app.listen(8000);
}
bootstrap();
