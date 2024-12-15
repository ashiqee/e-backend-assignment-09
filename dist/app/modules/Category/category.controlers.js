"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../share/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../share/sendResponse"));
const category_services_1 = require("./category.services");
const createCategory = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield category_services_1.CategoryServices.createACategory(req);
    (0, sendResponse_1.default)(res, {
        success: true,
        status: http_status_1.default.OK,
        message: "Category created succesfully",
        data: result
    });
}));
const getAllCategoryFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield category_services_1.CategoryServices.getAllCategory(req);
    (0, sendResponse_1.default)(res, {
        success: true,
        status: http_status_1.default.OK,
        message: "All Categories retrived succesfully",
        data: result
    });
}));
const getAllCategoryForPublicFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield category_services_1.CategoryServices.getAllCategoryFromDB();
    (0, sendResponse_1.default)(res, {
        success: true,
        status: http_status_1.default.OK,
        message: "ALL Public Categories retrived succesfully",
        data: result
    });
}));
const updateCategoryInDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield category_services_1.CategoryServices.updateCategory(req);
    (0, sendResponse_1.default)(res, {
        success: true,
        status: http_status_1.default.OK,
        message: "Category updated succesfully",
        data: result
    });
}));
const deleteCategoryFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield category_services_1.CategoryServices.deleteCategory(req);
    (0, sendResponse_1.default)(res, {
        success: true,
        status: http_status_1.default.OK,
        message: "Category deleted succesfully",
        data: result
    });
}));
const getOnlyCategoryFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield category_services_1.CategoryServices.getOnlyCategory(req);
    (0, sendResponse_1.default)(res, {
        success: true,
        status: http_status_1.default.OK,
        message: "Category data retrived succesfully",
        data: result
    });
}));
exports.categoryControllers = {
    createCategory,
    getAllCategoryFromDB,
    updateCategoryInDB,
    deleteCategoryFromDB,
    getOnlyCategoryFromDB,
    getAllCategoryForPublicFromDB
};
