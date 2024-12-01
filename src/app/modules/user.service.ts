import { Request } from "express";
import prisma from "../../share/prisma";



const createUser = async (req:Request)=>{

    const isNotExitsMember = await prisma.user.findUnique({
        where:{
            email: req.body.email
        }
    })

    if(isNotExitsMember){
         throw new Error("User is already exits")
    }

    const memberData = await prisma.user.create({
        data: req.body
    })

    return memberData;
    
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