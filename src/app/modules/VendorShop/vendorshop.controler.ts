import httpStatus from "http-status"
import catchAsync from "../../../share/catchAsync"
import sendResponse from "../../../share/sendResponse"
import { NextFunction, Request, Response } from "express"
import { vendorShopServices } from "./vendorshop.service"
import { CreateShopRequest } from "./vedorshop.interface"
import { userServices } from "../User/user.service"
import { IAuthUser } from "../../interfaces/common"




const createShopInDB = catchAsync(async (req: Request , res: Response) => {

     
    const result = await vendorShopServices.createShop(req);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: "Shop Created successfuly!",
        data: result
    })
});

const updatedShopInDB = catchAsync(async (req: Request, res: Response) => {

 
    
    const result = await vendorShopServices.updateVendorShop(req);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: "Shop Updated successfuly!",
        data: result
    })
});

const deleteShopFromDB = catchAsync(async (req: Request, res: Response) => {

    const result = await vendorShopServices.deleteVendorShop(req);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: "Shop deleted successfuly!",
        data: result
    })
});



const getAllShopFromDB = catchAsync(async (req: Request, res: Response) => {

 
    
    const result = await vendorShopServices.getAllShop(req);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: "All Shop retrived successfuly!",
        data: result
    })
});

// for vendor 
const getAllMyShopFromDB = catchAsync(async (req: Request, res: Response) => {

    console.log("hello");
    
 
    
    const result = await vendorShopServices.getMyAllShop(req);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: "All My Shop retrived successfuly!",
        data: result
    })
});


const getShopByVendorIdFromDB = catchAsync(async (req: Request, res: Response) => {

    
    const result = await vendorShopServices.getShopByVendorId(req);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: "Vendor Shop retrived successfuly!",
        data: result
    })
});


const blacklistedShopInDB = catchAsync(async (req: Request, res: Response) => {

    const result = await vendorShopServices.blacklistShop(req);
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: "Shop blacklisted successfuly!",
        data: result
    })
});






    export const shopControllers = {
        createShopInDB,
        getAllShopFromDB,
        updatedShopInDB,
        getShopByVendorIdFromDB,
        blacklistedShopInDB,
        deleteShopFromDB,
        getAllMyShopFromDB,
        
    }