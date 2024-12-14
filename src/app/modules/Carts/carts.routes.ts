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



// router.patch('/update/:id',  
//     auth(UserRole.ADMIN,UserRole.VENDOR),
// fileUploader.upload.array('files', 5),
// (req: Request, res: Response, next: NextFunction) => {       
//     req.body = productValidation.updateProductSchema.parse(JSON.parse(req.body.data))
//     return prodcutControllers.updateProduct(req, res, next)
// }
//  );

router.get('/',auth(UserRole.CUSTOMER), cartsControllers.getCartItems);


// router.get('/vendor', auth(UserRole.VENDOR) , prodcutControllers.getAllVendorProductFromDB);

// router.get('/:id',prodcutControllers.getAProductFromDB);

// router.delete('/delete/:id',prodcutControllers.deleteAProduct);



export const CartsItemRoutes = router;