import express, { NextFunction, Request, Response } from "express";
import { fileUploader } from "../../../helpers/fileUploader";

import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { categoryValidation } from "./category.validation";
import { categoryControllers } from "./category.controlers";







const router = express.Router();



router.post('/create',  
    auth(UserRole.ADMIN,UserRole.VENDOR),
    fileUploader.upload.single('file'),
(req: Request, res: Response, next: NextFunction) => {       
    req.body = categoryValidation.createCategorySchema.parse(JSON.parse(req.body.data))
    return categoryControllers.createCategory(req, res, next)
}
 )

router.get('/',categoryControllers.getAllCategoryFromDB)

router.get('/all',categoryControllers.getAllCategoryForPublicFromDB)

router.get('/:categoryId',categoryControllers.getOnlyCategoryFromDB)

router.patch('/update/:categoryId',
    auth(UserRole.ADMIN,UserRole.VENDOR),
    fileUploader.upload.single('file'),
(req: Request, res: Response, next: NextFunction) => {       
    req.body = categoryValidation.updateCategorySchema.parse(JSON.parse(req.body.data))
    return categoryControllers.updateCategoryInDB(req, res, next)
}
 )


 router.delete('/delete/:categoryId',
    auth(UserRole.ADMIN,UserRole.VENDOR),
    categoryControllers.deleteCategoryFromDB
 )


export const CategoryRoutes = router;