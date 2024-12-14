import { Request } from "express";
import { fileUploader } from "../../../helpers/fileUploader";
import prisma from "../../../share/prisma";
import { IFile } from "../../interfaces/file";
import { IAuthUser } from "../../interfaces/common";
import { error, log } from "console";
import pick from "../../../share/pick";
import { productFilterableFields, productFilterableOptions, productSearchAbleFields } from "./carts.constant";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { Prisma, VendorShopStatus } from "@prisma/client";



const addToCartInDB = async (req: Request & { user?: IAuthUser }) => {
    let { cart } = req.body; // Use 'let' for reassignment


    if (!Array.isArray(cart)) {
        cart = [cart];
    }

    // Validate cart
    if (cart.length === 0) {
        throw new Error("Cart must be a non-empty array.");
    }

    // Validate user
    const user = await prisma.user.findUniqueOrThrow({
        where: { email: req.user?.email },
        select: { id: true },
    });

    // Prepare cart data and process with upsert
    const results = await prisma.$transaction(
        cart.map((item:any) =>
            prisma.cartItem.upsert({
                where: {
                    userId_productId: { userId: user.id, productId: item.productId },
                },
                update: {
                    quantity: {
                        increment: item.quantity, 
                    },
                },
                create: {
                    userId: user.id,
                    productId: item.productId,
                    quantity: item.quantity, 
                },
                
            })
        )
    );

    return results;
};


const getCartItems = async (req: Request & { user?: IAuthUser })=>{


    // Validate user
    const user = await prisma.user.findUniqueOrThrow({
        where: { email: req.user?.email },
        select: { id: true },
    });


    console.log(user);
    
    
const result = await prisma.cartItem.findMany({
    where: {
        userId: user.id,        
    },
    include: {
            user: true,
            product: true,
        },
    
})

console.log("CARTS",result);


return result;

}


// update product 
const updateAProduct = async (req:Request )=>{
   
   
    const files = req.files as IFile[];
    const productId = parseInt(req.params.id);
    

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

    if(searchTerm){
        const searchString = String(searchTerm);
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
    
    
        console.log(allProducts,'h1');
    

        return {
            paginateData:{
                total,
                limit,
                page
            },
            products: transformedProducts
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



export const cartItemServices = {
    addToCartInDB,
    getCartItems,
    getAllProducts,
    getAProduct,
    deleteAProduct,
    updateAProduct,
    getAllVendorProducts
}