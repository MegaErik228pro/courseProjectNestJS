import { ForbiddenException, Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { RightsDto, UpdateDto } from "./dto";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import * as argon from 'argon2';

@Injectable()
export class UserService{
    constructor(private prisma: PrismaService) {};

    // МОЙ ПРОФИЛЬ

    async getMe(user: User){
        return user;
    }

    async deleteMe(user: User){
        try{
            await this.prisma.user.delete({
                where:{
                    IDUser: user.IDUser,
                }
            });
            return;
        }
        catch(error){
            throw error;
        }
    }

    async updateMe(user: User, dto: UpdateDto){
        const hash = await argon.hash(dto.password);
        console.log('new name ' + dto.name);
        await this.prisma.user.update({
            where: {
              IDUser: user.IDUser,
            },
            data: {
              Password: hash,
              Name: dto.name,
              PhoneNo: dto.phoneNo,
              Address: dto.address
            },
        })
    }

    // УПРАВЛЕНИЕ ПРОФИЛЯМИ

    async getAll() : Promise<object> {
        const users = await this.prisma.user.findMany({
            where: {
              OR: [
                { Role: 'user' },
                { Role: 'companyAdmin' }
              ]
            }
        });
        const companies = await this.prisma.company.findMany({});
        return { users, companies }
    }

    async delete(id: number){
        try{
            await this.prisma.user.delete({
                where:{
                    IDUser: id,
                }
            });
            return await this.prisma.user.findMany();
        }
        catch(error){
            if (error instanceof PrismaClientKnownRequestError){
                if (error.code === "P2025"){
                    throw new ForbiddenException('No such user');
                }
            }
            else
                throw error;
        }
    }

    async updateRights(dto: RightsDto, id: number){
        if(dto.role == 'user')       
            await this.prisma.user.update({
                where: {
                IDUser: id,
                },
                data: {
                Role: dto.role,
                AdminKey: null
                },
            });
        else
            await this.prisma.user.update({
                where: {
                IDUser: id,
                },
                data: {
                Role: dto.role,
                AdminKey: Number(dto.key)
                },
            });
    }
}