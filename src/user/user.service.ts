import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaClient, User } from "@prisma/client";
import { RightsDto, UpdateDto } from "./dto";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import * as argon from 'argon2';

const prisma = new PrismaClient();

@Injectable()
export class UserService{
    constructor() {};

    // МОЙ ПРОФИЛЬ

    async getMe(user: User){
        return user;
    }

    async deleteMe(user: User){
        try{
            await prisma.user.delete({
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
        await prisma.user.update({
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

    // МОИ ЗАКАЗЫ
    async getMyOrders(user: User) : Promise<object>{
        const orders = await prisma.order.findMany({
            where:{
                IDUser: user.IDUser
            }
        });
        return { orders }
    }

    // УПРАВЛЕНИЕ ПРОФИЛЯМИ

    async getAll() : Promise<object> {
        const users = await prisma.user.findMany({
            where: {
              OR: [
                { Role: 'user' },
                { Role: 'companyAdmin' }
              ]
            }
        });
        const companies = await prisma.company.findMany({});
        return { users, companies }
    }

    async delete(id: number){
        try{
            await prisma.user.delete({
                where:{
                    IDUser: id,
                }
            });
            return await prisma.user.findMany();
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
            await prisma.user.update({
                where: {
                IDUser: id,
                },
                data: {
                Role: dto.role,
                AdminKey: null
                },
            });
        else
            await prisma.user.update({
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