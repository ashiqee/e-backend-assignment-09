import express, { NextFunction, Request, Response } from "express";
import { fileUploader } from "../../../helpers/fileUploader";
import { shopControllers } from "./vendorshop.controler";
import { shopValidation } from "./vendorshop.validation";
import { CreateShopRequest } from "./vedorshop.interface";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { multerUpload } from "../../../config/multer.config";



const router = express.Router();

router.post('/create',  
    auth(UserRole.VENDOR),
    multerUpload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
               
        req.body = shopValidation.createShopSchema.parse(
            JSON.parse(req.body.data)
        );
        return shopControllers.createShopInDB(req, res, next);
    },
   
     );

router.patch('/update/:id',  
    auth(UserRole.ADMIN,UserRole.VENDOR),
    multerUpload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = shopValidation.updateShopSchema.parse(
            JSON.parse(req.body.data)
        );
        return shopControllers.updatedShopInDB(req, res, next);
    },
   
     );

router.put('/follow',  
    auth(UserRole.CUSTOMER),
  shopControllers.followShopInDB,
   
     );


router.delete('/',auth(UserRole.ADMIN,),shopControllers.deleteShopFromDB);

router.delete('/blacklist/:shopId',auth(UserRole.ADMIN,),shopControllers.blacklistedShopInDB);



router.get('/',shopControllers.getAllShopFromDB);

router.get('/vendor-shops',
    auth(UserRole.VENDOR),
    shopControllers.getAllMyShopFromDB);

router.get('/:id',shopControllers.getShopByVendorIdFromDB);
router.get('/products/:id',shopControllers.getShopByIdAllProductFromDB);

router.get('/orders/:id',auth(UserRole.VENDOR),shopControllers.getShopByVendorIdFromDB);





export const VendorShopsRoutes = router;