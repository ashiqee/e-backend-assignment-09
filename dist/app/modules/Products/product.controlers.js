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
exports.prodcutControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../share/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../share/sendResponse"));
const product_services_1 = require("./product.services");
const createProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_services_1.productServices.createAProduct(req);
    (0, sendResponse_1.default)(res, {
        success: true,
        status: http_status_1.default.OK,
        message: "Product created succesfully",
        data: result
    });
}));
const updateProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_services_1.productServices.updateAProduct(req);
    (0, sendResponse_1.default)(res, {
        success: true,
        status: http_status_1.default.OK,
        message: "Product updated succesfully",
        data: result
    });
}));
const getAllProductFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_services_1.productServices.getAllProducts(req);
    (0, sendResponse_1.default)(res, {
        success: true,
        status: http_status_1.default.OK,
        message: "Products retrive succesfully",
        data: result
    });
}));
const getAllVendorProductFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_services_1.productServices.getAllVendorProducts(req);
    (0, sendResponse_1.default)(res, {
        success: true,
        status: http_status_1.default.OK,
        message: "All vendor Products retrive succesfully",
        data: result
    });
}));
const getAProductFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_services_1.productServices.getAProduct(req);
    (0, sendResponse_1.default)(res, {
        success: true,
        status: http_status_1.default.OK,
        message: "Product retrive succesfully",
        data: result
    });
}));
const deleteAProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_services_1.productServices.deleteAProduct(req);
    (0, sendResponse_1.default)(res, {
        success: true,
        status: http_status_1.default.OK,
        message: "Product deleted succesfully",
        data: result
    });
}));
exports.prodcutControllers = {
    createProduct,
    getAllProductFromDB,
    getAProductFromDB,
    deleteAProduct,
    updateProduct,
    getAllVendorProductFromDB
};
