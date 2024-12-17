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
exports.couponServices = void 0;
const prisma_1 = __importDefault(require("../../../share/prisma"));
const pick_1 = __importDefault(require("../../../share/pick"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const coupon_constant_1 = require("./coupon.constant");
// Create a new coupon
const createCoupon = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { code, discountPercentage, expirationDate } = req.body;
    const isExistingCoupon = yield prisma_1.default.coupon.findUnique({
        where: { code },
    });
    if (isExistingCoupon) {
        throw new Error("Coupon code already exists");
    }
    const couponData = {
        code,
        discountPercentage: parseFloat(discountPercentage),
        expirationDate: new Date(expirationDate),
    };
    const result = yield prisma_1.default.coupon.create({
        data: couponData,
    });
    return result;
});
const getAllCoupons = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, coupon_constant_1.couponsFilterableFields);
    const options = (0, pick_1.default)(req.query, coupon_constant_1.couponsFilterableOptions);
    const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm } = filters, filterData = __rest(filters, ["searchTerm"]);
    const prismaFilter = {};
    if (searchTerm && typeof searchTerm === "string") {
        prismaFilter.OR = [
            { code: { contains: searchTerm, mode: "insensitive" } },
        ];
    }
    if (filterData.isActive !== undefined) {
        prismaFilter.isActive = filterData.isActive === "true";
    }
    const result = yield prisma_1.default.coupon.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
    });
    const total = yield prisma_1.default.coupon.count({
        where: prismaFilter,
    });
    return {
        meta: { page, limit, total },
        data: result,
    };
});
const getCouponById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.coupon.findUnique({
        where: { id },
    });
    if (!result) {
        throw new Error("Coupon not found");
    }
    return result;
});
// Update 
const updateCoupon = (id, req) => __awaiter(void 0, void 0, void 0, function* () {
    const { code, discountPercentage, expirationDate, isActive } = req.body;
    const updatedData = {
        code,
        discountPercentage: discountPercentage ? parseFloat(discountPercentage) : undefined,
        expirationDate: expirationDate ? new Date(expirationDate) : undefined,
        isActive: isActive !== undefined ? isActive : undefined,
    };
    const result = yield prisma_1.default.coupon.update({
        where: { id },
        data: updatedData,
    });
    return result;
});
// Delete 
const deleteCoupon = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.coupon.delete({
        where: { id },
    });
    return { message: "Coupon deleted successfully" };
});
// Validate 
const validateCoupon = (code) => __awaiter(void 0, void 0, void 0, function* () {
    const coupon = yield prisma_1.default.coupon.findFirst({
        where: {
            code,
            isActive: true,
            expirationDate: { gte: new Date() },
        },
    });
    if (!coupon) {
        throw new Error("Invalid or expired coupon");
    }
    return {
        valid: true,
        discountPercentage: coupon.discountPercentage,
    };
});
exports.couponServices = {
    createCoupon,
    getAllCoupons,
    getCouponById,
    updateCoupon,
    deleteCoupon,
    validateCoupon,
};
