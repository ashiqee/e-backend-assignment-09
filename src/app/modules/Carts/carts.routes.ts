import express, { NextFunction, Request, Response } from "express";


import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { cartsValidation } from "./carts.validation";
import { cartsControllers  } from "./carts.controlers";
import multer from "multer";


const upload = multer();


const router = express.Router();



router.post(
    '/addTocart',
    auth(UserRole.CUSTOMER),
    upload.none(), 
    (req: Request, res: Response, next: NextFunction) => {
      try {
        req.body = cartsValidation.addTocartSchema.parse(
          JSON.parse(req.body.data)
        );
        return cartsControllers.addToCart(req, res, next);
      } catch (error:any) {
        res.status(400).json({ error: error.message });
      }
    }
  );




router.get('/',auth(UserRole.CUSTOMER), cartsControllers.getCartItems);



router.delete('/delete/:id',auth(UserRole.CUSTOMER), cartsControllers.deleteCartItems);



export const CartsItemRoutes = router;