"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const review_controler_1 = require("./review.controler");
const router = express_1.default.Router();
router.post("/create", (0, auth_1.default)(client_1.UserRole.CUSTOMER), review_controler_1.reviewController.createReview);
router.get("/", (0, auth_1.default)(client_1.UserRole.CUSTOMER, client_1.UserRole.ADMIN), review_controler_1.reviewController.getReviewById);
router.put("/:id", (0, auth_1.default)(client_1.UserRole.CUSTOMER), (req, res, next) => {
    try {
        const { id } = req.params;
        // Update review details logic here
        res.json({ message: `Review with ID ${id} updated successfully.` });
    }
    catch (error) {
        next(error);
    }
});
router.delete("/:id", (0, auth_1.default)(client_1.UserRole.ADMIN), (req, res, next) => {
    try {
        const { id } = req.params;
        // Delete review logic here
        res.json({ message: `Review with ID ${id} deleted successfully.` });
    }
    catch (error) {
        next(error);
    }
});
router.get("/", (0, auth_1.default)(client_1.UserRole.CUSTOMER, client_1.UserRole.ADMIN), (req, res, next) => {
    try {
        const { page, limit, searchTerm } = req.query;
        // Fetch reviews logic here
        res.json({
            message: "Reviews fetched successfully.",
            data: { page, limit, searchTerm },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.ReviewRoutes = router;
