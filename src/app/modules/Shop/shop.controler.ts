import httpStatus from "http-status"
import catchAsync from "../../../share/catchAsync"
import sendResponse from "../../../share/sendResponse"
import { Request, Response } from "express"
import { shopServices } from "./shop.service"



const createShop = catchAsync( async( req: Request,res: Response)=>{
    
 
    const result =  await shopServices.createShop(req)
    
    
        sendResponse(res,{
            success:true,
            status: httpStatus.OK,
            message:"User created succesfully",
            data: result && "created Success"
        })
    } )
    

    export const shopControllers = {
        createShop
    }