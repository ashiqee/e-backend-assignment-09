
import { Request, Response } from "express";
import catchAsync from "../../share/catchAsync";
import sendResponse from "../../share/sendResponse";
import httpStatus from "http-status";
import { userServices } from "./user.service";





const createUser = catchAsync( async( req: Request,res: Response)=>{
    
const result =  await userServices.createUser(req)

    sendResponse(res,{
        success:true,
        status: httpStatus.OK,
        message:"User created succesfully",
        data: result
    })
} )


const getAllUsers = catchAsync(async(req:Request,res:Response)=>{
    const result = await userServices.getAllUsers()
    sendResponse(res,{
        success:true,
        status: httpStatus.OK,
        message:"Get all Users retrived succesfully",
        data: result
    })
})






export const usersControllers = {
    createUser,
    getAllUsers,
    
}