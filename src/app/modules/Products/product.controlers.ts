import httpStatus from "http-status"
import catchAsync from "../../../share/catchAsync"
import sendResponse from "../../../share/sendResponse"
import { Request, Response } from "express"
import { productServices } from "./product.services"



const createUser = catchAsync( async( req: Request,res: Response)=>{
    
 
    const result =  await productServices.createAProduct(req)
    
    
        sendResponse(res,{
            success:true,
            status: httpStatus.OK,
            message:"Product created succesfully",
            data: result 
        })
    } )
    