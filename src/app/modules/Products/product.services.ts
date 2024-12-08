import { Request } from "express";
import { fileUploader } from "../../../helpers/fileUploader";
import prisma from "../../../share/prisma";
import { IFile } from "../../interfaces/file";
import { IAuthUser } from "../../interfaces/common";
import { error } from "console";
import pick from "../../../share/pick";
import { productFilterableFields, productFilterableOptions, productSearchAbleFields } from "./product.constant";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { Prisma } from "@prisma/client";



const createAProduct = async (req:Request )=>{
   
   
    const files = req.files as IFile[];
    const {product}= req.body;
  
    

    const imageUrls: string[] = []
    if(files && files.length > 0){
        for (const file of files){
            const uploadCloudinary = await fileUploader.uploadToCloudinary(file);
            if(uploadCloudinary?.secure_url){
                imageUrls.push(uploadCloudinary.secure_url)
            }

        }
     
    }

    const productData = {
        name:product.name,
        price:product.price,
        description: product.description,
        inventoryCount: product.inventoryCount,
        images: imageUrls,
        discount: product.discount,
        categoryId:product.categoryId,
        vendorShopId:product.vendorShopId
    };

   
    
        const result = await prisma.product.create({
            data: productData,
            include:{
                vendorShop:true,
                category:true,
            }
        })
    

    return result;
    
}


const getAllProducts = async (req:Request)=>{

    const filters = pick(req.query, productFilterableFields);
    const options = pick(req.query, productFilterableOptions)

    const {page,limit,skip}= paginationHelper.calculatePagination(options);
    const {searchTerm,...filterData}= filters;
     
    const andConditions: Prisma.ProductWhereInput[]=[];

    if(filters.searchTerm){
        andConditions.push({
            OR: productSearchAbleFields.map(field=>({
                [field]:{
                    contains: filters.searchTerm,
                    mode: 'insensitive'
                }
            }))
        })
    }

    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    equals: (filterData as any)[key]
                }
            }))
        })
    };

    const whereConditons: Prisma.ProductWhereInput = andConditions.length > 0 ? { AND: andConditions } : {};

    const allProducts = await prisma.product.findMany({
        where: whereConditons,
        skip,
        take:limit,
        orderBy: options.sortBy && options.sortOrder ? {
            [options.sortBy as string]: options.sortOrder
        } : {
            createdAt: 'desc'
        },
    })

    return allProducts
}






export const productServices = {
    createAProduct,
    getAllProducts
}