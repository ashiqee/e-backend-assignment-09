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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewServices = void 0;
const prisma_1 = __importDefault(require("../../../share/prisma"));
const pick_1 = __importDefault(require("../../../share/pick"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const review_constant_1 = require("./review.constant");
// Create a new review
const createReview = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const exitsUser = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: (_a = req.user) === null || _a === void 0 ? void 0 : _a.email,
            role: "CUSTOMER"
        },
        select: {
            id: true,
        },
    });
    const { rating, comment, productId, userId } = req.body;
    const reviewData = {
        rating: parseInt(rating, 10),
        comment,
        productId: parseInt(productId, 10),
        userId: exitsUser.id,
    };
    const result = yield prisma_1.default.review.create({
        data: reviewData,
    });
    return result;
});
// Get all reviews with optional filters
const getAllReviews = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, review_constant_1.reviewsFilterableFields);
    const options = (0, pick_1.default)(req.query, review_constant_1.reviewsFilterableOptions);
    const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm } = filters, filterData = __rest(filters, ["searchTerm"]);
    const prismaFilter = {};
    if (searchTerm && typeof searchTerm === "string") {
        prismaFilter.OR = [
            { comment: { contains: searchTerm, mode: "insensitive" } },
        ];
    }
    if (filterData.productId) {
        prismaFilter.productId = parseInt(filterData.productId, 10);
    }
    const result = yield prisma_1.default.review.findMany({
        where: prismaFilter,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
            user: { select: { fullName: true } },
            product: { select: { name: true } },
        },
    });
    const total = yield prisma_1.default.review.count({
        where: prismaFilter,
    });
    return {
        meta: { page, limit, total },
        data: result,
    };
});
// Get a single review by ID
const getReviewByUserId = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const exitsUser = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: (_a = req.user) === null || _a === void 0 ? void 0 : _a.email,
            role: "CUSTOMER"
        },
        select: {
            id: true,
        },
    });
    const userId = exitsUser.id;
    const result = yield prisma_1.default.review.findMany({
        where: { userId: userId },
        include: {
            user: { select: { fullName: true } },
            product: {
                select: {
                    name: true,
                    images: true,
                    id: true,
                }
            },
        },
    });
    if (!result) {
        throw new Error("Review not found");
    }
    return result;
});
// Update a review
const updateReview = (id, req) => __awaiter(void 0, void 0, void 0, function* () {
    const { rating, comment } = req.body;
    const updatedData = {
        rating: rating ? parseInt(rating, 10) : undefined,
        comment: comment || undefined,
    };
    const result = yield prisma_1.default.review.update({
        where: { id },
        data: updatedData,
    });
    return result;
});
// Delete a review
const deleteReview = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.review.delete({
        where: { id },
    });
    return { message: "Review deleted successfully" };
});
// Validate a review for a specific user and product
const validateReview = (userId, productId) => __awaiter(void 0, void 0, void 0, function* () {
    const existingReview = yield prisma_1.default.review.findFirst({
        where: { userId, productId },
    });
    if (existingReview) {
        throw new Error("You have already reviewed this product");
    }
    return { valid: true };
});
exports.reviewServices = {
    createReview,
    getAllReviews,
    getReviewByUserId,
    updateReview,
    deleteReview,
    validateReview,
};
