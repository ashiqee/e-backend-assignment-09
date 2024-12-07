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



const getAllShopFromDB = catchAsync(async (req: Request, res: Response) => {

 
    
    const result = await vendorShopServices.getAllShop();
    sendResponse(res, {
        status: httpStatus.OK,
        success: true,
        message: "All Shop retrived successfuly!",
        data: result
    })
});




    export const shopControllers = {
        createShopInDB,
        getAllShopFromDB,
        updatedShopInDB
    }