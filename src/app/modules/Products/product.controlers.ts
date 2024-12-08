import httpStatus from "http-status"
import catchAsync from "../../../share/catchAsync"
import sendResponse from "../../../share/sendResponse"
import { Request, Response } from "express"
import { productServices } from "./product.services"
import pick from "../../../share/pick"
import { productFilterableFields, productFilterableOptions } from "./product.constant"



const createProduct = catchAsync( async( req: Request ,res: Response)=>{
    
 
    const result =  await productServices.createAProduct(req)
    
    
        sendResponse(res,{
            success:true,
            status: httpStatus.OK,
            message:"Product created succesfully",
            data: result 
        })
    } )
    
const getAllProductFromDB = catchAsync( async( req: Request ,res: Response)=>{
    console.log("HIT PROD");
    
    const result =  await productServices.getAllProducts(req)
    
    
        sendResponse(res,{
            success:true,
            status: httpStatus.OK,
            message:"Products retrive succesfully",
            data: result 
        })
    } )
    


export const prodcutControllers = {
    createProduct,
    getAllProductFromDB
}