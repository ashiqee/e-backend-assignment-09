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


const updateProduct = catchAsync( async( req: Request ,res: Response)=>{
    
 
    const result =  await productServices.updateAProduct(req)
    
    
        sendResponse(res,{
            success:true,
            status: httpStatus.OK,
            message:"Product updated succesfully",
            data: result 
        })
    } )
    
const getAllProductFromDB = catchAsync( async( req: Request ,res: Response)=>{
   
    
    const result =  await productServices.getAllProducts(req)
    
    
        sendResponse(res,{
            success:true,
            status: httpStatus.OK,
            message:"Products retrive succesfully",
            data: result 
        })
    } );



const getAllVendorProductFromDB = catchAsync( async( req: Request ,res: Response)=>{
   
    
    const result =  await productServices.getAllProducts(req)
    
    
        sendResponse(res,{
            success:true,
            status: httpStatus.OK,
            message:"All vendor Products retrive succesfully",
            data: result 
        })
    } )


const getAProductFromDB = catchAsync( async( req: Request ,res: Response)=>{

    
    const result =  await productServices.getAProduct(req)
    
    
        sendResponse(res,{
            success:true,
            status: httpStatus.OK,
            message:"Product retrive succesfully",
            data: result 
        })
    } )
    

const deleteAProduct = catchAsync( async( req: Request ,res: Response)=>{

    
    const result =  await productServices.deleteAProduct(req)
    
    
        sendResponse(res,{
            success:true,
            status: httpStatus.OK,
            message:"Product deleted succesfully",
            data: result 
        })
    } )
    


export const prodcutControllers = {
    createProduct,
    getAllProductFromDB,
    getAProductFromDB,
    deleteAProduct,
    updateProduct,
    getAllVendorProductFromDB
}