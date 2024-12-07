import { Request } from "express";
import { fileUploader } from "../../../helpers/fileUploader";
import prisma from "../../../share/prisma";
import { IFile } from "../../interfaces/file";



const createAProduct = async (req:Request )=>{
   

    const file = req.file as IFile;
    const productData = req.body

    let image = null
    if(file){
        const uploadCloudinary = await fileUploader.uploadToCloudinary(file);
        image = uploadCloudinary?.secure_url
    }

 

    const result = await prisma.product.create({
        data: productData,
      
    })

    return result;
    
}



export const productServices = {
    createAProduct
}