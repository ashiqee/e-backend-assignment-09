import express, { NextFunction, Request, Response } from "express";
import { fileUploader } from "../../../helpers/fileUploader";

import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { productValidation } from "./product.validation";
import { prodcutControllers } from "./product.controlers";





const router = express.Router();



router.post('/create-product',  
    auth(UserRole.ADMIN,UserRole.VENDOR),
fileUploader.upload.array('files', 5),
(req: Request, res: Response, next: NextFunction) => {       
    req.body = productValidation.createProductSchema.parse(JSON.parse(req.body.data))
    return prodcutControllers.createProduct(req, res, next)
}
 );

router.patch('/update/:id',  
    auth(UserRole.ADMIN,UserRole.VENDOR),
fileUploader.upload.array('files', 5),
(req: Request, res: Response, next: NextFunction) => {       
    req.body = productValidation.updateProductSchema.parse(JSON.parse(req.body.data))
    return prodcutControllers.updateProduct(req, res, next)
}
 );

router.get('/', prodcutControllers.getAllProductFromDB);


router.get('/vendor', auth(UserRole.VENDOR) , prodcutControllers.getAllVendorProductFromDB);

router.get('/:id',prodcutControllers.getAProductFromDB);

router.delete('/:id',prodcutControllers.deleteAProduct);



export const ProductRoutes = router;