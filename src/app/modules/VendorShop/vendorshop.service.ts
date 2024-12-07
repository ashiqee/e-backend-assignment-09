import { User, VendorShop, VendorShopStatus } from "@prisma/client";
import { fileUploader } from "../../../helpers/fileUploader";
import prisma from "../../../share/prisma";
import { IFile } from "../../interfaces/file";
import { Request } from "express";
import { log } from "console";
import { IAuthUser } from "../../interfaces/common";



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
    if(file){
        const uploadCloudinary = await fileUploader.uploadToCloudinary(file);
        logo = uploadCloudinary?.secure_url
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

    const vendorShopId = parseInt(req.params.id, 10); // Convert string to number

if (isNaN(vendorShopId)) {
    throw new Error("Invalid vendor shop ID");
}


    const file =req.file as IFile;
    let logo: string|null = null
    if(file){
        const uploadCloudinary = await fileUploader.uploadToCloudinary(file);
        logo = uploadCloudinary?.secure_url || null
    }

    const updateData: Record<string, any> = { ...req.body };
    if (logo) {
        updateData.logo = logo;
    }

    // updateVendorShop 
    const updateVenshop = await prisma.vendorShop.update({
        where :{ id: vendorShopId},
        data:updateData,

    })

    return updateVenshop;

}




const getAllShop = async ()=>{
    const allShop = await prisma.vendorShop.findMany({})

    return allShop
}


const getShopByVendorId = async (req: Request) =>{
    const result = await prisma.vendorShop.findUniqueOrThrow({
        where: {
          id: req.body.id,
          status: VendorShopStatus.ACTIVE,
          isDeleted : false
        },
        include: {
            products:true,
            orders:true,
            followers:true
            
        }
    })
}


export const vendorShopServices = {
    createShop,
    getAllShop,
    updateVendorShop
}