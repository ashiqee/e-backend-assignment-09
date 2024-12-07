import express, { NextFunction, Request, Response } from "express";
import { fileUploader } from "../../../helpers/fileUploader";
import { shopControllers } from "./vendorshop.controler";
import { shopValidation } from "./vendorshop.validation";
import { CreateShopRequest } from "./vedorshop.interface";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";



const router = express.Router();

router.post('/create-vendor-shop',  
    auth(UserRole.ADMIN,UserRole.VENDOR),
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
               
        req.body = shopValidation.createShopSchema.parse(
            JSON.parse(req.body.data)
        );
        return shopControllers.createShopInDB(req, res, next);
    },
   
     );

router.put('/updated-vendor-shop',  
    auth(UserRole.ADMIN,UserRole.VENDOR),
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = shopValidation.updateShopSchema.parse(
            JSON.parse(req.body.data)
        );
        return shopControllers.updatedShopInDB(req, res, next);
    },
   
     );


     


router.get('/',shopControllers.getAllShopFromDB)



     export const VendorShopsRoutes = router;