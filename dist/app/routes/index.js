"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_route_1 = require("../modules/User/user.route");
const auth_routes_1 = require("../modules/Auth/auth.routes");
const vendorshop_route_1 = require("../modules/VendorShop/vendorshop.route");
const product_routes_1 = require("../modules/Products/product.routes");
const category_routes_1 = require("../modules/Category/category.routes");
const carts_routes_1 = require("../modules/Carts/carts.routes");
const orders_routes_1 = require("../modules/Orders/orders.routes");
const router = express_1.default.Router();
const allRoutes = [
    {
        path: "/users",
        route: user_route_1.UsersRoutes,
    },
    {
        path: "/auth",
        route: auth_routes_1.AuthRoutes,
    },
    {
        path: "/vendorShop",
        route: vendorshop_route_1.VendorShopsRoutes,
    },
    {
        path: "/product",
        route: product_routes_1.ProductRoutes,
    },
    {
        path: "/carts",
        route: carts_routes_1.CartsItemRoutes,
    },
    {
        path: "/orders",
        route: orders_routes_1.OrdersRoutes,
    },
    {
        path: "/category",
        route: category_routes_1.CategoryRoutes,
    },
];
allRoutes.forEach(route => router.use(route.path, route.route));
exports.default = router;
