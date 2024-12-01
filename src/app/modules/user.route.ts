import express from "express";
import { usersControllers } from "./user.controller";





const router = express.Router();



router.post('/',usersControllers.createUser)
router.get('/',usersControllers.getAllUsers)



export const UsersRoutes = router;