import { Prisma, User, VendorShop, VendorShopStatus } from "@prisma/client";
import { fileUploader } from "../../../helpers/fileUploader";
import prisma from "../../../share/prisma";
import { IFile } from "../../interfaces/file";
import { Request } from "express";
import { log } from "console";
import { IAuthUser } from "../../interfaces/common";
import pick from "../../../share/pick";
import { vendorShopFilterableFields, vendorShopFilterableOptions, vendorShopSearchAbleFields } from "./vendorshop.constant";
import { paginationHelper } from "../../../helpers/paginationHelper";



const createShop  = async (req: Request  & {user?: IAuthUser})=>{

    const file =req.file as IFile;
    const shopData = req.body.shop

    const user = req.user
    const userInfo = await prisma.user.findUniqueOrThrow({
        where: {
            email: user?.email,
            status: "ACTIVE"
        }

    })

    
    
   
    let logo = null
    if (file) {
        logo = file.path
    }
   

    const vendorShopData = {
        name: shopData.name,
        logo:logo,
        description: shopData.description,
        ownerId: userInfo.id
    }

    const result = await prisma.vendorShop.create({
        data: vendorShopData,
        include :{
            owner: {
                select:{
                    fullName:true,
                    email:true,
                    profilePhoto:true,
                }
            }
        }
        
    })

    return result;
}

// updateshop info 

const updateVendorShop = async (req:Request)=>{

    const vendorShopId = parseInt(req.params.id); // Convert string to number

if (isNaN(vendorShopId)) {
    throw new Error("Invalid vendor shop ID");
}

const updateData: Record<string, any> = { ...req.body };


    const file =req.file as IFile;
  
    if (file) {
        updateData.logo = file.path;
    }

  

    // updateVendorShop 
    const updateVenshop = await prisma.vendorShop.update({
        where :{ id: vendorShopId},
        data:updateData,

    })

    return updateVenshop;

}


// for addmin 

const getAllShop = async (req:Request)=>{

    const filters = pick(req.query, vendorShopFilterableFields);
    const options = pick(req.query, vendorShopFilterableOptions)

    const {sortBy, sortOrder,page,limit,skip}= paginationHelper.calculatePagination(options);
    const {searchTerm,...filterData}= filters;
    const andConditions: Prisma.VendorShopWhereInput[]=[{ isDeleted: false },];

    if(searchTerm){
        andConditions.push({
            OR: vendorShopSearchAbleFields.map(field=>({
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

    const whereConditons: Prisma.VendorShopWhereInput = andConditions.length > 0 ? { AND: andConditions } : {};

   
    const allShops = await prisma.vendorShop.findMany({
        where: whereConditons,
        skip,
        take:limit,
        orderBy: sortBy && sortOrder ? {
            [sortBy as string]: sortOrder
        } : {
            createdAt: 'desc'
        },
        include:{
            owner:true,
            products:{
                include:{
                    category:true
                }
            }
        }
  });
 
  const transformedShops = allShops.map((shop) => ({
    id: shop.id,
    name: shop.name,
    logo: shop.logo,
    status:shop.status,
    ownerName: shop.owner?.fullName || "N/A",
    contactNumber: shop.owner?.contactNumber || "N/A",
    totalProducts: shop.products.length || 0,
  }));


    const total = await prisma.vendorShop.count({
        where: whereConditons
    })



    return {
        paginateData:{
            total,
            limit,
            page
        },
        data: transformedShops
    };
}


// for vendor 
const getMyAllShop = async (req: Request & { user?: IAuthUser }) => {
   
  
    const isNotExitsUser = await prisma.user.findUniqueOrThrow({
      where: {
        email: req.user?.email,
        role: "VENDOR"
      },
      select: {
        id: true,
      },
    });
  
    const filters = pick(req.query, vendorShopFilterableFields);
    const options = pick(req.query, vendorShopFilterableOptions);
  
    const { sortBy, sortOrder, page, limit, skip } = paginationHelper.calculatePagination(options);
    const { searchTerm, ...filterData } = filters;
    const andConditions: Prisma.VendorShopWhereInput[] = [
      { isDeleted: false },
      { ownerId: isNotExitsUser.id },
    ];

    
  
    if (searchTerm) {
        const searchString = String(searchTerm);
    
       
        
        andConditions.push({
            OR: [
                ...vendorShopSearchAbleFields.map((field) => ({
                    [field]: {
                        contains: searchString,
                        mode: 'insensitive',
                    },
                })),
                {
                    products: {
                        some: {
                            OR: [
                                {
                                    name: {
                                        contains: searchString,
                                        mode: 'insensitive',
                                    },
                                },
                                {
                                    category: {
                                        name: {
                                            contains: searchString,
                                            mode: 'insensitive',
                                        },
                                    },
                                },
                            ],
                        },
                    },
                },
            ],
        });
    }
    
  
    if (Object.keys(filterData).length > 0) {
      andConditions.push({
        AND: Object.keys(filterData).map((key) => ({
          [key]: {
            equals: (filterData as any)[key],
          },
        })),
      });
    }
  
    const whereConditons: Prisma.VendorShopWhereInput = andConditions.length > 0 ? { AND: andConditions } : {};
  
    const allShops = await prisma.vendorShop.findMany({
      where: whereConditons,
      skip,
      take: limit,
      orderBy: sortBy && sortOrder
        ? {
            [sortBy as string]: sortOrder,
          }
        : {
            createdAt: "desc",
          },
      include: {
       
        products: {
          include: {
            category: true,
            OrderItem: {
              include: {
                product:true,
                order:true
              },
            }
            
          },
        },
        followers: true,
      },
    });

   
    
  
    const allProducts = allShops.flatMap((shop) => shop.products);
    const productsWithCategoryName = allProducts.map((product) => ({
      ...product,
      categoryName: product.category?.name || "Uncategorized", // Add category name to products
    }));

  
    
    const transformedShops = allShops.map((shop) => ({
      id: shop.id,
      name: shop.name,
      logo: shop.logo,
      description: shop.description,
      status: shop.status,
      totalProducts: shop.products.length || 0,
      totalFollowers: shop.followers.length || 0,
    }));
  
    const total = await prisma.vendorShop.count({
      where: whereConditons,
    });

   
  
    return {
      paginateData: {
        total,
        limit,
        page,
      },
      shops: transformedShops,
      products: productsWithCategoryName,
      orders: allShops.flatMap((shop) => shop.products.flatMap((product) => product.OrderItem)),
      
    };
  };
  



const deleteVendorShop = async (req:Request)=>{
   
        try{

            const shopId= parseInt(req.params.shopId)
            const isNotExitsVendorShop = await prisma.vendorShop.findUnique({
                where:{
                    id: shopId,
                    isDeleted:false
                }
            })
        
            if(!isNotExitsVendorShop){
                 throw new Error("Shop not found")
            }
        
            const result =  await prisma.vendorShop.update({
                where: {
                    id: shopId
                },
                data:{
                    isDeleted: true
                }
                
            })
        
            return result;
        }catch(err){
            throw new Error("An error occurred while deleting the member")
        }
        
    }
    


const getShopByVendorId = async (req: Request) =>{

    const shopId = parseInt(req.params.id)
        const result = await prisma.vendorShop.findUniqueOrThrow({
        where: {
          id: shopId,
          status: VendorShopStatus.ACTIVE,
          isDeleted : false
        },
        include: { 
            products:
            {
                include:{
                    OrderItem:true,
                    category:true,
                    
                }
            },
            followers:true,
            
            
        }
    })

    return result
}

const getShopById= async (req: Request) =>{

    const shopId = parseInt(req.params.id)
        const result = await prisma.vendorShop.findUniqueOrThrow({
        where: {
          id: shopId,
          status: VendorShopStatus.ACTIVE,
          isDeleted : false
        },
        include: { 
            products:{
                include:{
                    category:true
                }
            },
            followers:true,
            
            
        }
    })

    return result
}



const blacklistShop = async (req:Request)=>{

    const shopId =parseInt(req.params.shopId)
    const existVendorShop = await prisma.vendorShop.findUniqueOrThrow({
        where:{
            id: shopId,
            isDeleted:false,
        }
    })

    if(!existVendorShop){
        throw new Error("Vendor SHop Not Exits")
    }

    const blackListResult = await prisma.vendorShop.update({
        where: {
            id: shopId
        },
        data:{
            status: existVendorShop.status === VendorShopStatus.ACTIVE ? VendorShopStatus.BLACKLISTED:VendorShopStatus.ACTIVE
        }
    })

    return blackListResult;
}

export const vendorShopServices = {
    createShop,
    getAllShop,
    updateVendorShop,
    getShopByVendorId,
    deleteVendorShop,
    blacklistShop,
    getMyAllShop,
    getShopById
}