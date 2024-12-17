"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)(); // Initialize Multer middleware
const router = express_1.default.Router();
router.post("/create", (0, auth_1.default)(client_1.UserRole.VENDOR), (req, res, next) => {
    try {
        res.status(201).json({ message: "Coupon created successfully!" });
    }
    catch (error) {
        next(error);
    }
});
router.get("/:id", (0, auth_1.default)(client_1.UserRole.VENDOR, client_1.UserRole.ADMIN), (req, res, next) => {
    try {
        const { id } = req.params;
        // Fetch coupon details logic here
        res.json({ message: `Coupon with ID ${id} retrieved successfully.` });
    }
    catch (error) {
        next(error);
    }
});
router.put("/:id", (0, auth_1.default)(client_1.UserRole.VENDOR), (req, res, next) => {
    try {
        const { id } = req.params;
        // Update coupon details logic here
        res.json({ message: `Coupon with ID ${id} updated successfully.` });
    }
    catch (error) {
        next(error);
    }
});
router.delete("/:id", (0, auth_1.default)(client_1.UserRole.ADMIN), (req, res, next) => {
    try {
        const { id } = req.params;
        // Delete coupon logic here
        res.json({ message: `Coupon with ID ${id} deleted successfully.` });
    }
    catch (error) {
        next(error);
    }
});
router.get("/", (0, auth_1.default)(client_1.UserRole.VENDOR, client_1.UserRole.ADMIN), (req, res, next) => {
    try {
        const { page, limit, searchTerm } = req.query;
        res.json({
            message: "Coupons fetched successfully.",
            data: { page, limit, searchTerm },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.CouponRoutes = router;
