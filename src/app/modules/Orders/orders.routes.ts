import express, { NextFunction, Request, Response } from "express";


import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import {  ordersValidation } from "./orders.validation";
import {  ordersControllers  } from "./orders.controlers";
import multer from "multer";


const upload = multer();


const router = express.Router();



router.post(
    '/create',
    auth(UserRole.CUSTOMER),
    upload.none(), 
    (req: Request, res: Response, next: NextFunction) => {
      try {
        req.body = ordersValidation.createOrderSchema.parse(
          JSON.parse(req.body.data)
        );
        return ordersControllers.createOrder(req, res, next);
      } catch (error:any) {
        res.status(400).json({ error: error.message });
      }
    }
  );


router.get('/getUserOrders',auth(UserRole.CUSTOMER),ordersControllers.getCustomerOrders)


export const OrdersRoutes = router;