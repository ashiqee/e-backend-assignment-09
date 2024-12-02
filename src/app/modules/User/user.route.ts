import express, { NextFunction, Request, Response } from "express";
import { usersControllers } from "./user.controller";
import { fileUploader } from "../../../helpers/fileUploader";
import { userValidation } from "./user.validation";





const router = express.Router();



router.post('/',  
fileUploader.upload.single('file'),
(req: Request, res: Response, next: NextFunction) => {
    req.body = userValidation.createUser.parse(JSON.parse(req.body.data))
    return usersControllers.createUser(req, res, next)
}
 )

router.get('/',usersControllers.getAllUsers)



export const UsersRoutes = router;