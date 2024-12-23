import express, { NextFunction, Request, Response } from "express";
import { usersControllers } from "./user.controller";
import { fileUploader } from "../../../helpers/fileUploader";
import { userValidation } from "./user.validation";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { multerUpload } from "../../../config/multer.config";





const router = express.Router();



router.post('/register',  
multerUpload.single('file'),
(req: Request, res: Response, next: NextFunction) => {
    req.body = userValidation.createUser.parse(JSON.parse(req.body.data))
    return usersControllers.createUser(req, res, next)
}
 )

router.get('/',auth(UserRole.ADMIN),usersControllers.getAllUsers)


router.get('/my-profile',auth(UserRole.ADMIN,UserRole.CUSTOMER,UserRole.VENDOR),usersControllers.getMyProfileFromDb)

router.get('/:userId',usersControllers.getAUsers)

router.put("/update",
auth(UserRole.ADMIN,UserRole.CUSTOMER,UserRole.VENDOR),
 usersControllers.updateAUser

)


router.delete('/delete/:userId',
    auth(UserRole.ADMIN),
    usersControllers.deleteAUserFromDB)

router.delete("/suspend/:userId",
auth(UserRole.ADMIN),
usersControllers.suspendAUser
)



export const UsersRoutes = router;