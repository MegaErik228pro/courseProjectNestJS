import { Module } from '@nestjs/common';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [CompanyController],
  providers: [CompanyService],
  imports: [JwtModule.register({})]
})
export class CompanyModule {}
