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
    
    const {product}= req.body; 
    
    
    let imagesUpload: string[] = [];
    
    if (Array.isArray(req?.files)) {
        imagesUpload = req.files.map((file: any) => file?.path) || [];
      }

    const productData = {
        name:product.name,
        price:product.price,
        description: product.description,
        inventoryCount: product.inventoryCount,
        images: imagesUpload,
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
    const productId = parseInt(req.params.id);

    const existingProduct = await prisma.product.findUnique({
        where: {
            id: productId,
        },
        select: {
            images: true, 
        },
    });

    let imagesUpload: string[] = [];
    
    if (Array.isArray(req?.files)) {
        imagesUpload = req.files.map((file: any) => file?.path) || [];
      }

   const updatedImages = Array.isArray(existingProduct?.images)
    ? [...existingProduct.images, ...imagesUpload]
    : imagesUpload;

    
    const productUpdateData = {
        ...req.body,
        images: updatedImages, 
    };
  
    
        const result = await prisma.product.update({
            where:{
                id: productId
            },
            data: productUpdateData,
           
        })
    

    return result;
    
}


const getAllProducts = async (req:Request)=>{

    const filters = pick(req.query, productFilterableFields);
    const options = pick(req.query, productFilterableOptions)

   

    const { sortBy, sortOrder, page, limit, skip } = paginationHelper.calculatePagination(options);
    const { searchTerm, ...filterData } = filters;

   
    

    const andConditions: Prisma.ProductWhereInput[]=[{ isDeleted: false },];

    if (filters.flashSale === 'true') {
        andConditions.push({ flashSale: true });
      }
    
      // Add searchTerm condition
      if (searchTerm) {
        const searchString = String(searchTerm);
        andConditions.push({
          OR: productSearchAbleFields.map((field) => ({
            [field]: {
              contains: searchString,
              mode: 'insensitive',
            },
          })),
        });
      }
    
      // Add other filter conditions
      if (Object.keys(filterData).length > 0) {
        andConditions.push({
          AND: Object.keys(filterData).map((key) => ({
            [key]: {
              equals: (filterData as any)[key],
            },
          })),
        });
      }
    
      // Final where condition
      const whereConditons: Prisma.ProductWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};
    
   

    const allProducts = await prisma.product.findMany({
        where: whereConditons,
        skip,
        take:limit,
        orderBy: sortBy && sortOrder ? {
            [sortBy as string]: sortOrder
        } : {
            createdAt: 'desc'
        },
        include:{
            reviews:true,
            recentProducts:true,
            category:true,
            vendorShop:true,
     }
    })

    const transformedProducts = allProducts.map((product) => ({
        id: product.id,
        name: product.name,
        images: product.images,
        price: product.price,
        inventoryCount: product.inventoryCount,
        discount: product.discount,
        category: product.category,
        flashSale: product.flashSale,
        description: product.description,
        vendorShop: product.vendorShop,
        categoryId:product.categoryId,
        vendorShopId:product.vendorShopId,
        reviews: product.reviews
        
      }));
    
    
        const total = await prisma.product.count({
            where: whereConditons
        })
        const flashSaleProduct = allProducts.filter(product => product.flashSale === true);

   

        return {
            paginateData:{
                total,
                limit,
                page
            },
            products: transformedProducts,
            flashSaleProduct
        };
}
const getAllVendorProducts = async (req:Request & {user?:IAuthUser} )=>{

    
    const isNotExitsVendorUser = await prisma.user.findUniqueOrThrow({
        where: {
          email: req.user?.email,
        },
        select: {
          id: true,
        },
      });

    const filters = pick(req.query, productFilterableFields);
    const options = pick(req.query, productFilterableOptions)

   
 
    const { sortBy, sortOrder, page, limit, skip } = paginationHelper.calculatePagination(options);
    const { searchTerm, ...filterData } = filters;
    const andConditions: Prisma.ProductWhereInput[] = [
      { isDeleted: false },
      { vendorShop: { ownerId: isNotExitsVendorUser.id } }
    ];
    if(searchTerm){
        const searchString = String(searchTerm); 
        andConditions.push({
            OR: productSearchAbleFields.map(field=>({
                [field]:{
                    contains: searchString,
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
        orderBy: sortBy && sortOrder ? {
            [sortBy as string]: sortOrder
        } : {
            createdAt: 'desc'
        },
        include:{
            OrderItem:true,
            reviews:true,
            recentProducts:true,
            category:true
     }
    })

    
    


    const transformedProducts = allProducts.map((product) => ({
        id: product.id,
        name: product.name,
        images: product.images,
        price: product.price,
        inventoryCount: product.inventoryCount,
        discount: product.discount,
        category: product.category,
        categoryId: product.categoryId,
        salesQty: product.salesQty,
        vendorShopId: product.vendorShopId,
        flashSale: product.flashSale,
        description: product.description,
        totalOrders: product.OrderItem.length || 0,
      }));
    
    
        const total = await prisma.product.count({
            where: whereConditons
        })
    
    
        return {
            paginateData:{
                total,
                limit,
                page
            },            
            vendorAllProducts: transformedProducts
        };
}


// get a product 

const getAProduct = async (req: Request) => {
    const productId = parseInt(req.params.id);

 
    const product = await prisma.product.findUniqueOrThrow({
        where: {
            id: productId,
            isDeleted: false
        },
        include: {
            category: true,
            vendorShop: true,
            reviews:{
                select:{
                     user:{
                        select:{
                            fullName:true,
                            profilePhoto:true,
                        }
                     },
                     rating:true,
                     comment:true,
                     createdAt:true
                }
            }
        }
    });

    if (!product.categoryId) {
        throw new Error("Product does not have an associated category.");
    }

   
    const similarProducts = await prisma.product.findMany({
        where: {
            categoryId: product.categoryId,
            isDeleted: false,
            id: { not: productId } 
        },
        include: {
            category: true,
            vendorShop: true
        }
    });

    return {
        product,
        similarProducts
    };
};



const updateFlashSaleStatus = async (req: Request)=>{
        const productId =parseInt(req.params.id)
        const status = req.body.status
    const result = await prisma.product.update({
        where: {
            id: productId,
            isDeleted:false
        },
        data:{
            flashSale: status
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
    updateAProduct,
    getAllVendorProducts,
    updateFlashSaleStatus
}