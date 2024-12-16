"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const orders_validation_1 = require("./orders.validation");
const orders_controlers_1 = require("./orders.controlers");
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)();
const router = express_1.default.Router();
router.post('/create', (0, auth_1.default)(client_1.UserRole.CUSTOMER), upload.none(), (req, res, next) => {
    try {
        req.body = orders_validation_1.ordersValidation.createOrderSchema.parse(JSON.parse(req.body.data));
        return orders_controlers_1.ordersControllers.createOrder(req, res, next);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.get('/getUserOrders', (0, auth_1.default)(client_1.UserRole.CUSTOMER), orders_controlers_1.ordersControllers.getCustomerOrders);
router.put('/statusChange/:id', (0, auth_1.default)(client_1.UserRole.VENDOR), orders_controlers_1.ordersControllers.orderItemStatusChange);
exports.OrdersRoutes = router;
