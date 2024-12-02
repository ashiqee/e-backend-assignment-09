import { Request } from "express";
import * as bcrypt from 'bcrypt'
import prisma from "../../../share/prisma";
import { fileUploader } from "../../../helpers/fileUploader";
import { IFile } from "../../interfaces/file";



const createUser = async (req:Request)=>{

   
    const isNotExitsMember = await prisma.user.findUnique({
        where:{
            email: req.body.user.email
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

    const hashedPassword: string = await bcrypt.hash(req.body.password,12);

    const userData = {
        fullName: req.body.user.fullName,
        email: req.body.user.email,
        contactNumber: req.body.user.contactNumber,
        role: req.body.user.role,
        profilePhoto: profilePhoto,
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


const getAllUsers = async ()=>{
    const allUsers = await prisma.user.findMany()

    return allUsers;
}


const getAMember =  async(req:Request)=>{
    const bookResult =  await prisma.user.findUniqueOrThrow({
        where: {
            id: req.params.userId
        }
    })

    return bookResult;
    
}

// update 
const updateMember =  async(req:Request)=>{
    const bookupdateResult =  await prisma.member.update({
        where: {
            memberId: req.params.memberId
        },
            data: req.body
        
    })

    return bookupdateResult;
    
}

// delete 
const deleteMember =  async(req:Request)=>{

    try{
        const isNotExitsMember = await prisma.member.findUnique({
            where:{
                memberId: req.params.memberId
            }
        })
    
        if(!isNotExitsMember){
             throw new Error("Member not found")
        }
    
        const bookdeletedResult =  await prisma.member.delete({
            where: {
                memberId: req.params.memberId
            },
               
            
        })
    
        return bookdeletedResult;
    }catch(err){
        throw new Error("An error occurred while deleting the member")
    }
    
}


export const userServices = {
    createUser,
    getAllUsers,
    getAMember,
    updateMember,
    deleteMember
}