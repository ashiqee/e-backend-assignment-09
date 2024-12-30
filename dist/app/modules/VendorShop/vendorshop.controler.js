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
exports.shopControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../share/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../share/sendResponse"));
const vendorshop_service_1 = require("./vendorshop.service");
const createShopInDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield vendorshop_service_1.vendorShopServices.createShop(req);
    (0, sendResponse_1.default)(res, {
        status: http_status_1.default.OK,
        success: true,
        message: "Shop Created successfuly!",
        data: result
    });
}));
const followShopInDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield vendorshop_service_1.vendorShopServices.followShop(req);
    (0, sendResponse_1.default)(res, {
        status: http_status_1.default.OK,
        success: true,
        message: result,
        data: result
    });
}));
const updatedShopInDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield vendorshop_service_1.vendorShopServices.updateVendorShop(req);
    (0, sendResponse_1.default)(res, {
        status: http_status_1.default.OK,
        success: true,
        message: "Shop Updated successfuly!",
        data: result
    });
}));
const deleteShopFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield vendorshop_service_1.vendorShopServices.deleteVendorShop(req);
    (0, sendResponse_1.default)(res, {
        status: http_status_1.default.OK,
        success: true,
        message: "Shop deleted successfuly!",
        data: result
    });
}));
const getAllShopFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield vendorshop_service_1.vendorShopServices.getAllShop(req);
    (0, sendResponse_1.default)(res, {
        status: http_status_1.default.OK,
        success: true,
        message: "All Shop retrived successfuly!",
        data: result
    });
}));
// for vendor 
const getAllMyShopFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield vendorshop_service_1.vendorShopServices.getMyAllShop(req);
    (0, sendResponse_1.default)(res, {
        status: http_status_1.default.OK,
        success: true,
        message: "All My Shop retrived successfuly!",
        data: result
    });
}));
const getShopByVendorIdFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield vendorshop_service_1.vendorShopServices.getShopByVendorId(req);
    (0, sendResponse_1.default)(res, {
        status: http_status_1.default.OK,
        success: true,
        message: "Vendor Shop retrived successfuly!",
        data: result
    });
}));
const getShopByIdAllProductFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield vendorshop_service_1.vendorShopServices.getShopById(req);
    (0, sendResponse_1.default)(res, {
        status: http_status_1.default.OK,
        success: true,
        message: "Vendor Shop retrived successfuly!",
        data: result
    });
}));
const blacklistedShopInDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield vendorshop_service_1.vendorShopServices.blacklistShop(req);
    (0, sendResponse_1.default)(res, {
        status: http_status_1.default.OK,
        success: true,
        message: "Shop blacklisted successfuly!",
        data: result
    });
}));
exports.shopControllers = {
    createShopInDB,
    getAllShopFromDB,
    updatedShopInDB,
    getShopByVendorIdFromDB,
    blacklistedShopInDB,
    deleteShopFromDB,
    getAllMyShopFromDB,
    getShopByIdAllProductFromDB,
    followShopInDB
};
