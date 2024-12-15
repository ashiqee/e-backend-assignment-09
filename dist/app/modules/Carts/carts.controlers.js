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
exports.cartsControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../share/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../share/sendResponse"));
const carts_services_1 = require("./carts.services");
const addToCart = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield carts_services_1.cartItemServices.addToCartInDB(req);
    (0, sendResponse_1.default)(res, {
        success: true,
        status: http_status_1.default.OK,
        message: "Cart item added succesfully",
        data: result
    });
}));
const getCartItems = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield carts_services_1.cartItemServices.getCartItems(req);
    (0, sendResponse_1.default)(res, {
        success: true,
        status: http_status_1.default.OK,
        message: "Cart item retrive succesfully",
        data: result
    });
}));
const deleteCartItems = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield carts_services_1.cartItemServices.deleteCartsItem(req);
    (0, sendResponse_1.default)(res, {
        success: true,
        status: http_status_1.default.OK,
        message: "Cart item delted succesfully",
        data: result
    });
}));
exports.cartsControllers = {
    addToCart,
    getCartItems,
    deleteCartItems
};
