import { Request } from "express";
import { fileUploader } from "../../../helpers/fileUploader";
import prisma from "../../../share/prisma";
import { IFile } from "../../interfaces/file";




const createACategory = async (req:Request )=>{
   
   
    
    const {category}= req.body;
  
    

    const file =req.file as IFile;
    let image: string|null = null
    if(file){
        const uploadCloudinary = await fileUploader.uploadToCloudinary(file);
        image = uploadCloudinary?.secure_url || null
    }

   

    const CategoryData = {
        name:category.name,
        image: image 
    };

        const result = await prisma.category.create({
            data: CategoryData,
           
        })


    return result;
    
}



export const CategoryServices = {
    createACategory
}