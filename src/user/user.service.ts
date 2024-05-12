import { ForbiddenException, Injectable } from "@nestjs/common";
import { Order, PrismaClient, User } from "@prisma/client";
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

    // ЗАКАЗЫ
    async getMyOrders(user: User) : Promise<object>{
        const orders = await prisma.order.findMany({
            where:{
                IDUser: user.IDUser
            }
        });

        const ordersWithCompanyNames = await getCompanyNamesForOrders(orders);

        const formattedOrders = ordersWithCompanyNames.map(order => {
            return {
                ...order,
                OrderDate: formatDateTime(order.OrderDate)
            };
        });

        function formatDateTime(date: Date): string {
            const options: Intl.DateTimeFormatOptions = {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            };
            return date.toLocaleString('ru-RU', options);
        }

        async function getCompanyNamesForOrders(orders : Order[]) {
            const result = [];
        
            for (const order of orders) {
                const companyId = order.IDCompany;
                const company = await prisma.company.findFirst({
                    where: {
                        IDCompany: companyId
                    }
                });
        
                if (company) {
                    result.push({
                        ...order,
                        Company: company.Name
                    });
                }
            }
        
            return result;
        }

        return { orders: formattedOrders, title: 'Мои заказы' }
    }

    async getAllOrders() : Promise<object>{
        const orders = await prisma.order.findMany({});

        const ordersWithCompanyNames = await getCompanyNamesForOrders(orders);

        const formattedOrders = ordersWithCompanyNames.map(order => {
            return {
                ...order,
                OrderDate: formatDateTime(order.OrderDate)
            };
        });

        function formatDateTime(date: Date): string {
            const options: Intl.DateTimeFormatOptions = {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            };
            return date.toLocaleString('ru-RU', options);
        }

        async function getCompanyNamesForOrders(orders : Order[]) {
            const result = [];
        
            for (const order of orders) {
                const companyId = order.IDCompany;
                const company = await prisma.company.findFirst({
                    where: {
                        IDCompany: companyId
                    }
                });
        
                if (company) {
                    result.push({
                        ...order,
                        Company: company.Name
                    });
                }
            }
        
            return result;
        }

        return { orders: formattedOrders, title: 'Текущие заказы' }
    }

    async getCompanyOrders(user: User) : Promise<object>{
        const company = await prisma.company.findFirst({
            where:{
                IDCompany: Number(user.AdminKey)
            }
        });
        const orders = await prisma.order.findMany({
            where:{
                IDCompany: company?.IDCompany
            }
        });

        const ordersWithCompanyNames = await getCompanyNamesForOrders(orders);

        const formattedOrders = ordersWithCompanyNames.map(order => {
            return {
                ...order,
                OrderDate: formatDateTime(order.OrderDate)
            };
        });

        function formatDateTime(date: Date): string {
            const options: Intl.DateTimeFormatOptions = {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            };
            return date.toLocaleString('ru-RU', options);
        }

        async function getCompanyNamesForOrders(orders : Order[]) {
            const result = [];
        
            for (const order of orders) {
                const companyId = order.IDCompany;
                const company = await prisma.company.findFirst({
                    where: {
                        IDCompany: companyId
                    }
                });
        
                if (company) {
                    result.push({
                        ...order,
                        Company: company.Name
                    });
                }
            }
        
            return result;
        }

        return { orders: formattedOrders, title: 'Текущие заказы' }
    }

    // ИСТОРИЯ ЗАКАЗОВ
    async getHistory() : Promise<object>{
        const history = await prisma.history.findMany({});

        const formattedHistory = history.map(hist => {
            return {
                ...hist,
                OrderDate: formatDateTime(hist.OrderDate)
            };
        });

        function formatDateTime(date: Date): string {
            const options: Intl.DateTimeFormatOptions = {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            };
            return date.toLocaleString('ru-RU', options);
        }

        return { history: formattedHistory }
    }

    async getCompanyHistory(user: User) : Promise<object>{
        const company = await prisma.company.findFirst({
            where:{
                IDCompany: Number(user.AdminKey)
            }
        });
        const history = await prisma.history.findMany({
            where:{
                Company: company?.Name
            }
        });

        const formattedHistory = history.map(hist => {
            return {
                ...hist,
                OrderDate: formatDateTime(hist.OrderDate)
            };
        });

        function formatDateTime(date: Date): string {
            const options: Intl.DateTimeFormatOptions = {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            };
            return date.toLocaleString('ru-RU', options);
        }

        return { history: formattedHistory }
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