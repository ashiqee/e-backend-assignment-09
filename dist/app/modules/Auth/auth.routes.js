"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("./auth.controller");
const client_1 = require("@prisma/client");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = express_1.default.Router();
router.post('/login', auth_controller_1.AuthController.loginUser);
router.post('/refresh-token', auth_controller_1.AuthController.refreshToken);
router.post('/change-password', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.VENDOR, client_1.UserRole.CUSTOMER), auth_controller_1.AuthController.changePassword);
router.post('/forgot-password', auth_controller_1.AuthController.forgotPassword);
router.post('/reset-password', auth_controller_1.AuthController.resetPassword);
exports.AuthRoutes = router;
