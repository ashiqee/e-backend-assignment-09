import express, { NextFunction, Request, Response } from "express";
import { fileUploader } from "../../../helpers/fileUploader";
import { shopControllers } from "./shop.controler";
import { shopValidation } from "./shop.validation";



const router = express.Router();

router.post('/',  
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = shopValidation.createShop.parse(JSON.parse(req.body.data))
        return shopControllers.createShop(req, res, next)
    }
     )





     export const ShopsRoutes = router;