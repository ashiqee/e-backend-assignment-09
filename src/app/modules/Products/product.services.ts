import { Request } from "express";
import { fileUploader } from "../../../helpers/fileUploader";
import prisma from "../../../share/prisma";
import { IFile } from "../../interfaces/file";
import { IAuthUser } from "../../interfaces/common";
import { error, log } from "console";
import pick from "../../../share/pick";
import { productFilterableFields, productFilterableOptions, productSearchAbleFields } from "./product.constant";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { Prisma, VendorShopStatus } from "@prisma/client";



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

// update product 
const updateAProduct = async (req:Request )=>{
   
   
    const files = req.files as IFile[];
    
    

    const imageUrls: string[] = []
    if(files && files.length > 0){
        for (const file of files){
            const uploadCloudinary = await fileUploader.uploadToCloudinary(file);
            if(uploadCloudinary?.secure_url){
                imageUrls.push(uploadCloudinary.secure_url)
            }

        }
        req.body.images = imageUrls
    }

    const productUpdateData = req.body

    
  
    
        const result = await prisma.product.update({
            where:{
                id: productUpdateData.id
            },
            data: productUpdateData,
           
        })
    

    return result;
    
}


const getAllProducts = async (req:Request)=>{

    const filters = pick(req.query, productFilterableFields);
    const options = pick(req.query, productFilterableOptions)

   

    const {page,limit,skip}= paginationHelper.calculatePagination(options);
    const {searchTerm,...filterData}= filters;
    
    const andConditions: Prisma.ProductWhereInput[]=[{ isDeleted: false },];

    if(searchTerm){
        andConditions.push({
            OR: productSearchAbleFields.map(field=>({
                [field]:{
                    contains: searchTerm,
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


// get a product 

const getAProduct = async (req: Request)=>{
        const productId =parseInt(req.params.id)
    const result = await prisma.product.findUniqueOrThrow({
        where: {
            id: productId,
            isDeleted:false
        }
    })

    return result;
   
}


// Delete a product 

const deleteAProduct = async (req: Request)=>{
        const productId =parseInt(req.params.id)
        await prisma.product.findUniqueOrThrow({
            where: {
              id:productId,
              isDeleted: false,
              vendorShop: {
                isDeleted: false,
                status: VendorShopStatus.ACTIVE,
              },
            },
          });
        
          const softDeleteProduct = await prisma.product.update({
            where: {
              id:productId,
            },
            data: {
              isDeleted: true,
            },
          });
        
          return softDeleteProduct;
        };



export const productServices = {
    createAProduct,
    getAllProducts,
    getAProduct,
    deleteAProduct,
    updateAProduct
}