
import { Request, Response } from "express";
import catchAsync from "../../../share/catchAsync";
import { payServices } from "./payment.service";


const confirmationController = catchAsync(async (req:Request,res:Response)=>{
  
    
    const {transactionId} = req.query;

    const result = await payServices.confirmationService(transactionId as string);


    res.send(result)
})


export const paymentController ={
    confirmationController
}