import { User, VendorShop } from "@prisma/client";
import { fileUploader } from "../../../helpers/fileUploader";
import prisma from "../../../share/prisma";
import { IFile } from "../../interfaces/file";
import { Request } from "express";



const createShop  = async (req: Request)=>{

    const file =req.file as IFile;
    const shopData = req.body.shop
   
    let logo = null
    if(file){
        const uploadCloudinary = await fileUploader.uploadToCloudinary(file);
        logo = uploadCloudinary?.secure_url
    }

    const vendorShopData = {
        name: shopData.name,
        logo:logo,
        description: shopData.description,
        ownerId: shopData.ownerId
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



const getAllShop = async ()=>{
    const allShop = await prisma.vendorShop.findMany({})

    return allShop
}





export const vendorShopServices = {
    createShop,
    getAllShop
}