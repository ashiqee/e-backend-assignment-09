import { fileUploader } from "../../../helpers/fileUploader";
import prisma from "../../../share/prisma";
import { IFile } from "../../interfaces/file";




const createShop = async (req:Request)=>{
   
    const isNotExitsMember = await prisma.vendorShop.findUnique({
        where:{
            name: req.body.shop.name
        }
    })

    if(isNotExitsMember){
         throw new Error("User is already exits")
    }

    const file = req.file as IFile;

    let profilePhoto = null
    if(file){
        const uploadCloudinary = await fileUploader.uploadToCloudinary(file);
        profilePhoto = uploadCloudinary?.secure_url
    }

  

    const userData = {
        fullName: req.body.user.fullName,
        email: req.body.user.email,
        contactNumber: req.body.user.contactNumber,
        role: req.body.user.role,
        profilePhoto: profilePhoto,
        address:req.body.user.address,
        password: hashedPassword
    }

  
    

    const result = await prisma.user.create({
        data: userData,
        select:{
            id:true,
            email:true,
            fullName:true,
            role:true,
            status:true,
            createdAt:true,
            updatedAt:true,
            
        }
    })

    return result;
    
}




export const shopServices = {
    createShop
}