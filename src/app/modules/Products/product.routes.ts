import express, { NextFunction, Request, Response } from "express";
import { fileUploader } from "../../../helpers/fileUploader";

import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";





const router = express.Router();



router.post('/',  
fileUploader.upload.single('file'),
(req: Request, res: Response, next: NextFunction) => {
    req.body = userValidation.createUser.parse(JSON.parse(req.body.data))
    return usersControllers.createUser(req, res, next)
}
 )

router.get('/',auth(UserRole.ADMIN),usersControllers.getAllUsers)

router.get('/:userId',usersControllers.getAUsers)



export const ProductRoutes = router;