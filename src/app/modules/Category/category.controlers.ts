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
    
const getAllCategoryFromDB = catchAsync( async( req: Request ,res: Response)=>{
    
 
    const result =  await CategoryServices.getAllCategory(req)
    
    
        sendResponse(res,{
            success:true,
            status: httpStatus.OK,
            message:"Categories retrived succesfully",
            data: result 
        })
    } )
    
const updateCategoryInDB = catchAsync( async( req: Request ,res: Response)=>{
    
 
    const result =  await CategoryServices.updateCategory(req)
    
    
        sendResponse(res,{
            success:true,
            status: httpStatus.OK,
            message:"Category updated succesfully",
            data: result 
        })
    } )
    
const deleteCategoryFromDB = catchAsync( async( req: Request ,res: Response)=>{
    
 
    const result =  await CategoryServices.deleteCategory(req)
    
    
        sendResponse(res,{
            success:true,
            status: httpStatus.OK,
            message:"Category deleted succesfully",
            data: result 
        })
    } )
    
const getOnlyCategoryFromDB = catchAsync( async( req: Request ,res: Response)=>{
    
 
    const result =  await CategoryServices.getOnlyCategory(req)
    
    
        sendResponse(res,{
            success:true,
            status: httpStatus.OK,
            message:"Category data retrived succesfully",
            data: result 
        })
    } )
    


export const categoryControllers = {
    createCategory,
    getAllCategoryFromDB,
    updateCategoryInDB,
    deleteCategoryFromDB,
    getOnlyCategoryFromDB
}