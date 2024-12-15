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
exports.usersControllers = void 0;
const catchAsync_1 = __importDefault(require("../../../share/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../share/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const user_service_1 = require("./user.service");
const createUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.userServices.createUser(req);
    (0, sendResponse_1.default)(res, {
        success: true,
        status: http_status_1.default.OK,
        message: "User created succesfully",
        data: result && "created Success"
    });
}));
const getAllUsers = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.userServices.getAllUsers(req);
    (0, sendResponse_1.default)(res, {
        success: true,
        status: http_status_1.default.OK,
        message: "Get all Users retrived succesfully",
        data: result
    });
}));
const getAUsers = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.userServices.getAUsers(req);
    (0, sendResponse_1.default)(res, {
        success: true,
        status: http_status_1.default.OK,
        message: "Get A User retrived succesfully",
        data: result
    });
}));
const getMyProfileFromDb = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.userServices.getMyProfile(req);
    (0, sendResponse_1.default)(res, {
        success: true,
        status: http_status_1.default.OK,
        message: "Get My Profile retrived succesfully",
        data: result
    });
}));
const updateAUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.userServices.updateUser(req);
    (0, sendResponse_1.default)(res, {
        success: true,
        status: http_status_1.default.OK,
        message: "User updated succesfully",
        data: result
    });
}));
const suspendAUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.userServices.suspendUser(req);
    (0, sendResponse_1.default)(res, {
        success: true,
        status: http_status_1.default.OK,
        message: "User suspended succesfully",
        data: result
    });
}));
const deleteAUserFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.userServices.deleteUser(req);
    (0, sendResponse_1.default)(res, {
        success: true,
        status: http_status_1.default.OK,
        message: "User deleted succesfully",
        data: result
    });
}));
exports.usersControllers = {
    createUser,
    getAllUsers,
    getAUsers,
    updateAUser,
    suspendAUser,
    getMyProfileFromDb,
    deleteAUserFromDB
};
