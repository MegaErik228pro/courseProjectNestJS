import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

@Injectable()
export class AppService {
  getHello(user: User){
    return user;
  }
}
