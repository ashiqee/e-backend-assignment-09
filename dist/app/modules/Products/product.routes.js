"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const product_validation_1 = require("./product.validation");
const product_controlers_1 = require("./product.controlers");
const multer_config_1 = require("../../../config/multer.config");
const router = express_1.default.Router();
router.post('/create-product', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.VENDOR), multer_config_1.multerUpload.array('files', 5), (req, res, next) => {
    req.body = product_validation_1.productValidation.createProductSchema.parse(JSON.parse(req.body.data));
    return product_controlers_1.prodcutControllers.createProduct(req, res, next);
});
router.patch('/update/:id', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.VENDOR), multer_config_1.multerUpload.array('files', 5), (req, res, next) => {
    req.body = product_validation_1.productValidation.updateProductSchema.parse(JSON.parse(req.body.data));
    return product_controlers_1.prodcutControllers.updateProduct(req, res, next);
});
router.get('/', product_controlers_1.prodcutControllers.getAllProductFromDB);
router.get('/vendor', (0, auth_1.default)(client_1.UserRole.VENDOR), product_controlers_1.prodcutControllers.getAllVendorProductFromDB);
router.get('/:id', product_controlers_1.prodcutControllers.getAProductFromDB);
router.delete('/delete/:id', product_controlers_1.prodcutControllers.deleteAProduct);
exports.ProductRoutes = router;
