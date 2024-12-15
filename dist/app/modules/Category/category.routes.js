"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRoutes = void 0;
const express_1 = __importDefault(require("express"));
const fileUploader_1 = require("../../../helpers/fileUploader");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const category_validation_1 = require("./category.validation");
const category_controlers_1 = require("./category.controlers");
const router = express_1.default.Router();
router.post('/create', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.VENDOR), fileUploader_1.fileUploader.upload.single('file'), (req, res, next) => {
    req.body = category_validation_1.categoryValidation.createCategorySchema.parse(JSON.parse(req.body.data));
    return category_controlers_1.categoryControllers.createCategory(req, res, next);
});
router.get('/', category_controlers_1.categoryControllers.getAllCategoryFromDB);
router.get('/all', category_controlers_1.categoryControllers.getAllCategoryForPublicFromDB);
router.get('/:categoryId', category_controlers_1.categoryControllers.getOnlyCategoryFromDB);
router.patch('/update/:categoryId', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.VENDOR), fileUploader_1.fileUploader.upload.single('file'), (req, res, next) => {
    req.body = category_validation_1.categoryValidation.updateCategorySchema.parse(JSON.parse(req.body.data));
    return category_controlers_1.categoryControllers.updateCategoryInDB(req, res, next);
});
router.delete('/delete/:categoryId', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.VENDOR), category_controlers_1.categoryControllers.deleteCategoryFromDB);
exports.CategoryRoutes = router;
