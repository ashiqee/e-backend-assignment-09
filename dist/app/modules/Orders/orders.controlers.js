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
exports.ordersControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../share/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../share/sendResponse"));
const orders_services_1 = require("./orders.services");
const createOrder = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield orders_services_1.OrdersServices.createOrderInDB(req);
    (0, sendResponse_1.default)(res, {
        success: true,
        status: http_status_1.default.OK,
        message: "Create a order succesfully",
        data: result
    });
}));
// const getOrdersVendorShops = catchAsync( async( req: Request ,res: Response)=>{
//     const result =  await OrdersServices.getCartItems(req)
//         sendResponse(res,{
//             success:true,
//             status: httpStatus.OK,
//             message:"Vendor All Orders retrive succesfully",
//             data: result 
//         })
//     } )
// get order items for admin 
const getOrdersAllItems = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield orders_services_1.OrdersServices.getOrderAllForAdmin(req);
    (0, sendResponse_1.default)(res, {
        success: true,
        status: http_status_1.default.OK,
        message: "All Orders retrive succesfully",
        data: result
    });
}));
const getCustomerOrders = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield orders_services_1.OrdersServices.getCustomerOrderHistory(req);
    (0, sendResponse_1.default)(res, {
        success: true,
        status: http_status_1.default.OK,
        message: "All Customer Orders retrive succesfully",
        data: result
    });
}));
const cancelOrder = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield orders_services_1.OrdersServices.cancelOrder(req);
    (0, sendResponse_1.default)(res, {
        success: true,
        status: http_status_1.default.OK,
        message: "Order cancel succesfully",
        data: result
    });
}));
const orderItemStatusChange = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield orders_services_1.OrdersServices.updateOrderStatusChange(req);
    (0, sendResponse_1.default)(res, {
        success: true,
        status: http_status_1.default.OK,
        message: "Order status change succesfully",
        data: result
    });
}));
exports.ordersControllers = {
    createOrder,
    getOrdersAllItems,
    cancelOrder,
    getCustomerOrders,
    orderItemStatusChange
};
