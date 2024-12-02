import express from "express";
import { UsersRoutes } from "../modules/User/user.route";


const router = express.Router();


const allRoutes = [
    {
        path:"/users",
        route: UsersRoutes
    },
    
    
];

allRoutes.forEach( route => router.use(route.path,route.route))


export default router;