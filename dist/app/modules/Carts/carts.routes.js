"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartsItemRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const carts_validation_1 = require("./carts.validation");
const carts_controlers_1 = require("./carts.controlers");
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)();
const router = express_1.default.Router();
router.post('/addTocart', (0, auth_1.default)(client_1.UserRole.CUSTOMER), upload.none(), (req, res, next) => {
    try {
        req.body = carts_validation_1.cartsValidation.addTocartSchema.parse(JSON.parse(req.body.data));
        return carts_controlers_1.cartsControllers.addToCart(req, res, next);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.get('/', (0, auth_1.default)(client_1.UserRole.CUSTOMER), carts_controlers_1.cartsControllers.getCartItems);
router.delete('/delete/:id', (0, auth_1.default)(client_1.UserRole.CUSTOMER), carts_controlers_1.cartsControllers.deleteCartItems);
exports.CartsItemRoutes = router;
