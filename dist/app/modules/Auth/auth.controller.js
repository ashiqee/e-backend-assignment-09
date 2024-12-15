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
exports.AuthController = void 0;
const auth_service_1 = require("./auth.service");
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../share/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../share/sendResponse"));
const loginUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_service_1.AuthServices.loginUser(req.body);
    const { refreshToken } = result;
    res.cookie('refreshToken', refreshToken, {
        secure: false,
        httpOnly: true
    });
    (0, sendResponse_1.default)(res, {
        status: http_status_1.default.OK,
        success: true,
        message: "Logged in successfully!",
        data: {
            accessToken: result.accessToken,
            refreshToken: refreshToken,
            needPasswordChange: result.needPasswordChange
        }
    });
}));
const refreshToken = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.cookies;
    const result = yield auth_service_1.AuthServices.refreshToken(refreshToken);
    (0, sendResponse_1.default)(res, {
        status: http_status_1.default.OK,
        success: true,
        message: "Access token genereated successfully!",
        data: result
        // data: {
        //     accessToken: result.accessToken,
        //     needPasswordChange: result.needPasswordChange
        // }
    });
}));
const changePassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield auth_service_1.AuthServices.changePassword(user, req.body);
    (0, sendResponse_1.default)(res, {
        status: http_status_1.default.OK,
        success: true,
        message: "Password Changed successfully",
        data: result
    });
}));
const forgotPassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield auth_service_1.AuthServices.forgotPassword(req.body);
    (0, sendResponse_1.default)(res, {
        status: http_status_1.default.OK,
        success: true,
        message: "Check your email!",
        data: null
    });
}));
const resetPassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers.authorization || "";
    yield auth_service_1.AuthServices.resetPassword(token, req.body);
    (0, sendResponse_1.default)(res, {
        status: http_status_1.default.OK,
        success: true,
        message: "Password Reset!",
        data: null
    });
}));
exports.AuthController = {
    loginUser,
    refreshToken,
    changePassword,
    forgotPassword,
    resetPassword
};
