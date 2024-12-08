import httpStatus from "http-status"
import catchAsync from "../../../share/catchAsync"
import sendResponse from "../../../share/sendResponse"
import { Request, Response } from "express"
import { CategoryServices } from "./category.services"




const createCategory = catchAsync( async( req: Request ,res: Response)=>{
    
 
    const result =  await CategoryServices.createACategory(req)
    
    
        sendResponse(res,{
            success:true,
            status: httpStatus.OK,
            message:"Category created succesfully",
            data: result 
        })
    } )
    


export const categoryControllers = {
    createCategory
}