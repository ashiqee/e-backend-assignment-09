import express from "express";
import { UsersRoutes } from "../modules/User/user.route";
import { AuthRoutes } from "../modules/Auth/auth.routes";
import { VendorShopsRoutes } from "../modules/VendorShop/vendorshop.route";


const router = express.Router();


const allRoutes = [
    {
        path:"/users",
        route: UsersRoutes,
    },
    {
        path:"/auth",
        route:AuthRoutes,
    },
    {
        path:"/vendorShop",
        route: VendorShopsRoutes,
    }
    
    
];

allRoutes.forEach( route => router.use(route.path,route.route))


export default router;