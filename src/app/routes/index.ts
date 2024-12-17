import express from "express";
import { UsersRoutes } from "../modules/User/user.route";
import { AuthRoutes } from "../modules/Auth/auth.routes";
import { VendorShopsRoutes } from "../modules/VendorShop/vendorshop.route";
import { ProductRoutes } from "../modules/Products/product.routes";
import { CategoryRoutes } from "../modules/Category/category.routes";
import { CartsItemRoutes } from "../modules/Carts/carts.routes";
import { OrdersRoutes } from "../modules/Orders/orders.routes";
import { CouponRoutes } from "../modules/Coupons/coupon.routes";
import { PaymentRoutes } from "../modules/Payments/payment.route";


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
    },
    {
        path:"/product",
        route: ProductRoutes,
    },
    {
        path:"/carts",
        route: CartsItemRoutes,
    },
    {
        path:"/orders",
        route: OrdersRoutes,
    },
    {
        path:"/category",
        route: CategoryRoutes,
    },
    {
        path:"/coupons",
        route: CouponRoutes,
    },
    {
        path:"/payment",
        route: PaymentRoutes,
    },
    
    
];

allRoutes.forEach( route => router.use(route.path,route.route))


export default router;