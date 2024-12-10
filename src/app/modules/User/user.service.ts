import { Request } from "express";
import * as bcrypt from 'bcrypt'
import prisma from "../../../share/prisma";
import { fileUploader } from "../../../helpers/fileUploader";
import { IFile } from "../../interfaces/file";
import { IAuthUser } from "../../interfaces/common";
import { usersFilterableFields, usersFilterableOptions, usersSearchAbleFields } from "./user.constant";
import pick from "../../../share/pick";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { Prisma } from "@prisma/client";



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


const getAllUsers = async (req:Request)=>{

    const filters = pick(req.query, usersFilterableFields);
    const options = pick(req.query, usersFilterableOptions)
    const {page,limit,skip}= paginationHelper.calculatePagination(options);
    const {searchTerm , ...filterData} = filters;

  
    

    const andConditions: Prisma.UserWhereInput[]=[{ isDeleted: false },];

    if(searchTerm){
        andConditions.push({
            OR: usersSearchAbleFields.map(field=>({
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

    const whereConditons: Prisma.UserWhereInput = andConditions.length > 0 ? { AND: andConditions } : {};

    console.log(whereConditons);
    
   
    const allUsers = await prisma.user.findMany({
        where: whereConditons,
        skip,
        take:limit,
        select:{
            id:true,
            email:true,
            fullName:true,
            role:true,
            status:true,
            profilePhoto:true,
            contactNumber:true,

            createdAt:true,
            updatedAt:true,
            
        }
       
    })
    
    const total = await prisma.user.count({
        where: whereConditons
    })



    return {
        paginateData:{
            total,
            limit,
            page
        },
        data: allUsers
    };
}


const getAUsers =  async(req:Request)=>{
    const user =  await prisma.user.findUniqueOrThrow({
        where: {
            id: req.params.userId
        },
        select:{
            id:true,
            email:true,
            fullName:true,
            profilePhoto:true,
            contactNumber:true,
            address:true,
            role:true,
            status:true
        }
    })

    return user;
    
}

const getMyProfile =  async(req:Request & {user?: IAuthUser})=>{
    const user = req.user;
    const userInfo =  await prisma.user.findUniqueOrThrow({
        where: {
            email: user!.email
        },
        select:{
            id:true,
            email:true,
            fullName:true,
            profilePhoto:true,
            contactNumber:true,
            address:true,
            role:true,
            status:true,
            vendorShops:true
        },
    })

    return userInfo;
    
}

// update user role 



// update 
const updateUser = async (req: Request) => {
    try {
        const { userId } = req.params;
        const file = req.file as IFile | undefined;

        // Validate input
        if (!userId) {
            throw new Error("User is Not Found")
        }

        // Upload profile photo if provided
        let profilePhoto: string | null = null;
        if (file) {
            const uploadCloudinary = await fileUploader.uploadToCloudinary(file);
            profilePhoto = uploadCloudinary?.secure_url || null;
        }

        const updateData: Record<string, any> = { ...req.body };
        if (profilePhoto) {
            updateData.profilePhoto = profilePhoto;
        }

        // Update the user
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateData,
        });

        return updatedUser;
    } catch (error) {
        console.error('Error updating user:', error);
      
    }
};



// delete 
const deleteUser =  async(req:Request)=>{

    try{
        const isNotExitsMember = await prisma.user.findUnique({
            where:{
                id: req.params.userId
            }
        })
    
        if(!isNotExitsMember){
             throw new Error("User not found")
        }
    
        const result =  await prisma.user.delete({
            where: {
                id: req.params.userId
            },
               
            
        })
    
        return result;
    }catch(err){
        throw new Error("An error occurred while deleting the member")
    }
    
}

const suspendUser =  async(req:Request)=>{

    try{
        const isNotExitsMember = await prisma.user.findUnique({
            where:{
                id: req.params.userId
            }
        })
    
        if(!isNotExitsMember){
             throw new Error("User not found")
        }
    
        const result =  await prisma.user.update({
            where: {
                id: req.params.userId
            },
            data:{
                status: "BLOCKED"
            }
               
            
        })
    
        return result;
    }catch(err){
        throw new Error("An error occurred while deleting the member")
    }
    
}


export const userServices = {
    createUser,
    getAllUsers,
    getAUsers,
    updateUser,
    deleteUser,
    suspendUser,
    getMyProfile
}