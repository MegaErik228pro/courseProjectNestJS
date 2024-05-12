import { Injectable, NotFoundException } from "@nestjs/common";
import { CategoryDto, CompanyDto, ProductDto } from "./dto";
import { Session } from "express-session";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

@Injectable()
export class CompanyService{
    constructor() {};

    // ПОЛУЧЕНИЕ ДАННЫХ

    async getAll() : Promise<object> {
        const companies = await prisma.company.findMany();
        const search = null;
        return { companies, search };
    }

    async getAllSearch(search: string) : Promise<object> {
        const companies = await prisma.company.findMany({
            where: {
                Name: {
                    contains: search,
                },
            },
        });
        return { companies, search };
    }

    async getCompany(id: number, session: Session) : Promise<object> {
        try{
            const searchProduct = null;
            const searchAllergen = null;
            const company = await prisma.company.findFirst({
                where:{
                    IDCompany: id
                },
                include:{
                    Category:{
                        include:{
                            Product: true
                        }
                    }
                }
            });
            if (!company)
                throw new NotFoundException('Страницы не существует');
            console.log(session);
            return { company, searchProduct, searchAllergen, session};
        }
        catch(error){
            throw error;
        }
    }

    async getCompanySearchProduct(id: number, searchProduct: string, session: Session) : Promise<object> {
        const searchAllergen = null;
        const company = await prisma.company.findFirst({
            where:{
                IDCompany: id
            },
            include:{
                Category:{
                    include:{
                        Product:{
                            where:{
                                Name: {
                                    contains: searchProduct,
                                },
                            }
                        }
                    }
                }
            }
        });
        if (!company)
            throw new NotFoundException('Страницы не существует');
        return { company, searchProduct, searchAllergen, session};
    }

    async getCompanySearchAllergen(id: number, searchAllergen: string, session: Session) : Promise<object> {
        const searchProduct = null;
        const allergens = searchAllergen.split('');
        const company = await prisma.company.findFirst({
            where:{
                IDCompany: id
            },
            include:{
                Category:{
                    include:{
                        Product:{
                            where:{
                                NOT: allergens.map(allergen => ({
                                    Allergens: {
                                        contains: allergen,
                                    }
                                }))
                            }
                        }
                    }
                }
            }
        });
        if (!company)
            throw new NotFoundException('Страницы не существует');
        return { company, searchProduct, searchAllergen, session};
    }

    async getCompanySearchProductAndAllergen(id: number, searchProduct: string, searchAllergen: string, session: Session) : Promise<object> {
        const allergens = searchAllergen.split('');
        const company = await prisma.company.findFirst({
            where:{
                IDCompany: id
            },
            include:{
                Category:{
                    include:{
                        Product:{
                            where:{
                                Name: {
                                    contains: searchProduct,
                                },
                                NOT: allergens.map(allergen => ({
                                    Allergens: {
                                        contains: allergen,
                                    }
                                }))
                            }
                        }
                    }
                }
            }
        });
        if (!company)
            throw new NotFoundException('Страницы не существует');
        return { company, searchProduct, searchAllergen, session};
    }

    async getCategory(id: number) : Promise<object> {
        const category = await prisma.category.findFirst({
            where:{
                IDCategory: id
            }
        });
        return { category };
    }

    async getCategoryCurrentAndAll(idCompany: number, idCategory: number) : Promise<object> {
        const categories = await prisma.category.findMany({
            where:{
                IDCompany: idCompany
            }
        });
        const category = await prisma.category.findFirst({
            where:{
                IDCategory: idCategory
            }
        });
        return { categories, category };
    }

    async getCategoryCurrentAndAllAndProduct(idCompany: number, idCategory: number, idProduct: number) : Promise<object> {
        const categories = await prisma.category.findMany({
            where:{
                IDCompany: idCompany
            }
        });
        const category = await prisma.category.findFirst({
            where:{
                IDCategory: idCategory
            }
        });
        const product = await prisma.product.findFirst({
            where:{
                IDProduct: idProduct
            }
        });
        return { categories, category, product };
    }

    async getProduct(productId: number) : Promise<object>{
        const product = await prisma.product.findFirst({
            where:{
                IDProduct: productId
            }
        });
        return { product }
    }

    async getProductDetails(productId: number) : Promise<object>{
        const product = await prisma.product.findFirst({
            where:{
                IDProduct: productId
            }
        });
        let allergenString = "";
        if (product?.Allergens)
        {
            const allergens = product?.Allergens.split('');
            for (const element of allergens) {
                const allergenName = await prisma.allergen.findFirst({
                    where:{
                        IDAllergen: Number(element)
                    },
                    select: {
                      Name: true
                    }
                });
                allergenString += allergenName?.Name + '(' + element + '), ';
            }
           allergenString = allergenString.substring(0, allergenString.length - 2);
        }
        else
        {
            allergenString = 'Аллергены отсутствуют';
        }
        return await { product: {
            ...product,
            allergenString
        }};
    }

    // УПРАВЛЕНИЕ

    async createCompany(dto: CompanyDto) : Promise<object> {
        return await prisma.company.create({
            data:{
                Name: dto.name,
                ImagePath: dto.path
            }
        });
    }

    async updateCompany(id: number, dto: CompanyDto){
        return await prisma.company.update({
            where:{
                IDCompany: id
            },
            data:{
                Name: dto.name,
                ImagePath: dto.path
            }
        });
    }

    async deleteCompany(id: number){
        await prisma.company.delete({
            where:{
                IDCompany: id
            },
            include:{
                Category:{
                    include:{
                        Product: true
                    }
                }
            }
        })
    }

    async createCategory(id: number, dto: CategoryDto){
        return await prisma.category.create({
            data:{
                Name: dto.name,
                IDCompany: id
            }
        });
    }

    async updateCategory(categoryId: number, dto: CategoryDto){
        return await prisma.category.update({
            where:{
                IDCategory: categoryId
            },
            data:{
                Name: dto.name
            }
        });
    }

    async deleteCategory(categoryId: number){
        await prisma.category.delete({
            where:{
                IDCategory: categoryId
            }
        });
    }

    async createProduct(id: number, dto: ProductDto){
        return await prisma.product.create({
            data:{
                Name: dto.name,
                IDCategory: Number(dto.category),
                ImagePath: dto.path,
                Description: dto.description,
                Allergens: dto.allergens,
                Gram: Number(dto.gram),
                Price: Number(dto.price),
            }
        });
    }

    async updateProduct(productId: number, dto: ProductDto){
        return await prisma.product.update({
            where:{
                IDProduct: productId
            },
            data:{
                Name: dto.name,
                ImagePath: dto.path,
                Description: dto.description,
                Allergens: dto.allergens,
                Gram: Number(dto.gram),
                Price: Number(dto.price),
                IDCategory: Number(dto.category)
            }
        });
    }

    async deleteProduct(productId: number){
        await prisma.product.delete({
            where:{
                IDProduct: productId
            }
        });
    }
}