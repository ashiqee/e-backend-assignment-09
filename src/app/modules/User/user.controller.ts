
import { Request, Response } from "express";
import catchAsync from "../../../share/catchAsync";
import sendResponse from "../../../share/sendResponse";
import httpStatus from "http-status";
import { userServices } from "./user.service";





const createUser = catchAsync( async( req: Request,res: Response)=>{
    
 
const result =  await userServices.createUser(req)


    sendResponse(res,{
        success:true,
        status: httpStatus.OK,
        message:"User created succesfully",
        data: result && "created Success"
    })
} )


const getAllUsers = catchAsync(async(req:Request,res:Response)=>{
    const result = await userServices.getAllUsers(req)
    sendResponse(res,{
        success:true,
        status: httpStatus.OK,
        message:"Get all Users retrived succesfully",
        data: result
    })
})

const getAUsers = catchAsync(async(req:Request,res:Response)=>{
    const result = await userServices.getAUsers(req)
    sendResponse(res,{
        success:true,
        status: httpStatus.OK,
        message:"Get A User retrived succesfully",
        data: result
    })
})

const getMyProfileFromDb = catchAsync(async(req:Request,res:Response)=>{
    const result = await userServices.getMyProfile(req)
    sendResponse(res,{
        success:true,
        status: httpStatus.OK,
        message:"Get My Profile retrived succesfully",
        data: result
    })
})



const updateAUser = catchAsync( async( req: Request, res: Response)=>{
    
 
    const result =  await userServices.updateUser(req)
    
    
        sendResponse(res,{
            success:true,
            status: httpStatus.OK,
            message:"User updated succesfully",
            data: result 
        })
    } )
    


const suspendAUser = catchAsync( async( req: Request,res: Response)=>{
    
 
    const result =  await userServices.suspendUser(req)
    
    
        sendResponse(res,{
            success:true,
            status: httpStatus.OK,
            message:"User suspended succesfully",
            data: result 
        })
    } )
    
const deleteAUserFromDB = catchAsync( async( req: Request,res: Response)=>{
    
 
    const result =  await userServices.deleteUser(req)
    
    
        sendResponse(res,{
            success:true,
            status: httpStatus.OK,
            message:"User deleted succesfully",
            data: result 
        })
    } )
    




export const usersControllers = {
    createUser,
    getAllUsers,
    getAUsers,
    updateAUser,
    suspendAUser,
    getMyProfileFromDb,
    deleteAUserFromDB
    
}