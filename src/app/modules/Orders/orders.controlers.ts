import httpStatus from "http-status"
import catchAsync from "../../../share/catchAsync"
import sendResponse from "../../../share/sendResponse"
import { Request, Response } from "express"
import {  OrdersServices } from "./orders.services"
import pick from "../../../share/pick"



const createOrder = catchAsync( async( req: Request ,res: Response)=>{
    
    const result =  await OrdersServices.createOrderInDB(req)
    
    
        sendResponse(res,{
            success:true,
            status: httpStatus.OK,
            message:"Create a order succesfully",
            data: result 
        })
    } )

const createPayOrder = catchAsync( async( req: Request ,res: Response)=>{
    
    const result =  await OrdersServices.createPaymentOrderInDB(req)
    
    
        sendResponse(res,{
            success:true,
            status: httpStatus.OK,
            message:"Create a order succesfully",
            data: result 
        })
    } )

// const getOrdersVendorShops = catchAsync( async( req: Request ,res: Response)=>{
    
//     const result =  await OrdersServices.getCartItems(req)
    
    
//         sendResponse(res,{
//             success:true,
//             status: httpStatus.OK,
//             message:"Vendor All Orders retrive succesfully",
//             data: result 
//         })
//     } )


// get order items for admin 
const getOrdersAllItems = catchAsync( async( req: Request ,res: Response)=>{
    
    const result =  await OrdersServices.getOrderAllForAdmin(req)
    
    
        sendResponse(res,{
            success:true,
            status: httpStatus.OK,
            message:"All Orders retrive succesfully",
            data: result 
        })
    } )

const getCustomerOrders = catchAsync( async( req: Request ,res: Response)=>{
    
    const result =  await OrdersServices.getCustomerOrderHistory(req)
    
    
        sendResponse(res,{
            success:true,
            status: httpStatus.OK,
            message:"All Customer Orders retrive succesfully",
            data: result 
        })
    } )

const getCustomerOrdersForAdmin = catchAsync( async( req: Request ,res: Response)=>{
    
    const result =  await OrdersServices.getCustomerAllOrderHistoryForAdmin(req)
    
    
        sendResponse(res,{
            success:true,
            status: httpStatus.OK,
            message:"All Customer Orders retrive succesfully",
            data: result 
        })
    } )



const cancelOrder = catchAsync( async( req: Request ,res: Response)=>{
    
    const result =  await OrdersServices.cancelOrder(req)
    
    
        sendResponse(res,{
            success:true,
            status: httpStatus.OK,
            message:"Order cancel succesfully",
            data: result 
        })
    } )

const orderItemStatusChange = catchAsync( async( req: Request ,res: Response)=>{
    
    const result =  await OrdersServices.updateOrderStatusChange(req)
    
    
        sendResponse(res,{
            success:true,
            status: httpStatus.OK,
            message:"Order status change succesfully",
            data: result 
        })
    } )



export const ordersControllers = {
    createOrder,
    getOrdersAllItems,
    cancelOrder,
    getCustomerOrders,
    orderItemStatusChange,
    createPayOrder,
    getCustomerOrdersForAdmin
  
}