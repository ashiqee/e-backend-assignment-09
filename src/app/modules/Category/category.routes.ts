import express, { NextFunction, Request, Response } from "express";
import { fileUploader } from "../../../helpers/fileUploader";

import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { categoryValidation } from "./category.validation";
import { categoryControllers } from "./category.controlers";







const router = express.Router();



router.post('/create-category',  
    auth(UserRole.ADMIN,UserRole.VENDOR),
    fileUploader.upload.single('file'),
(req: Request, res: Response, next: NextFunction) => {       
    req.body = categoryValidation.createCategorySchema.parse(JSON.parse(req.body.data))
    return categoryControllers.createCategory(req, res, next)
}
 )

// router.get('/',auth(UserRole.ADMIN),prodcutControllers.getAllUsers)

// router.get('/:userId',prodcutControllers.getAUsers)



export const CategoryRoutes = router;