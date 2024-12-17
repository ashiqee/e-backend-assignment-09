"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorShopsRoutes = void 0;
const express_1 = __importDefault(require("express"));
const vendorshop_controler_1 = require("./vendorshop.controler");
const vendorshop_validation_1 = require("./vendorshop.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const multer_config_1 = require("../../../config/multer.config");
const router = express_1.default.Router();
router.post('/create', (0, auth_1.default)(client_1.UserRole.VENDOR), multer_config_1.multerUpload.single('file'), (req, res, next) => {
    req.body = vendorshop_validation_1.shopValidation.createShopSchema.parse(JSON.parse(req.body.data));
    return vendorshop_controler_1.shopControllers.createShopInDB(req, res, next);
});
router.patch('/update/:id', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.VENDOR), multer_config_1.multerUpload.single('file'), (req, res, next) => {
    req.body = vendorshop_validation_1.shopValidation.updateShopSchema.parse(JSON.parse(req.body.data));
    return vendorshop_controler_1.shopControllers.updatedShopInDB(req, res, next);
});
router.delete('/', (0, auth_1.default)(client_1.UserRole.ADMIN), vendorshop_controler_1.shopControllers.deleteShopFromDB);
router.delete('/blacklist/:shopId', (0, auth_1.default)(client_1.UserRole.ADMIN), vendorshop_controler_1.shopControllers.blacklistedShopInDB);
router.get('/', vendorshop_controler_1.shopControllers.getAllShopFromDB);
router.get('/vendor-shops', (0, auth_1.default)(client_1.UserRole.VENDOR), vendorshop_controler_1.shopControllers.getAllMyShopFromDB);
router.get('/:id', vendorshop_controler_1.shopControllers.getShopByVendorIdFromDB);
router.get('/products/:id', vendorshop_controler_1.shopControllers.getShopByIdAllProductFromDB);
router.get('/orders/:id', (0, auth_1.default)(client_1.UserRole.VENDOR), vendorshop_controler_1.shopControllers.getShopByVendorIdFromDB);
exports.VendorShopsRoutes = router;
