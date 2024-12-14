import httpStatus from "http-status"
import catchAsync from "../../../share/catchAsync"
import sendResponse from "../../../share/sendResponse"
import { Request, Response } from "express"
import { cartItemServices } from "./carts.services"
import pick from "../../../share/pick"
import { productFilterableFields, productFilterableOptions } from "./carts.constant"



const addToCart = catchAsync( async( req: Request ,res: Response)=>{
    
    const result =  await cartItemServices.addToCartInDB(req)
    
    
        sendResponse(res,{
            success:true,
            status: httpStatus.OK,
            message:"Cart item added succesfully",
            data: result 
        })
    } )


const getCartItems = catchAsync( async( req: Request ,res: Response)=>{
    
    const result =  await cartItemServices.getCartItems(req)
    
    
        sendResponse(res,{
            success:true,
            status: httpStatus.OK,
            message:"Cart item retrive succesfully",
            data: result 
        })
    } )



const deleteCartItems = catchAsync( async( req: Request ,res: Response)=>{
    
    const result =  await cartItemServices.deleteCartsItem(req)
    
    
        sendResponse(res,{
            success:true,
            status: httpStatus.OK,
            message:"Cart item delted succesfully",
            data: result 
        })
    } )



export const cartsControllers = {
    addToCart,
    getCartItems,
    deleteCartItems
  
}