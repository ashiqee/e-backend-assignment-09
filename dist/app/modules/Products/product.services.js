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
exports.productServices = void 0;
const fileUploader_1 = require("../../../helpers/fileUploader");
const prisma_1 = __importDefault(require("../../../share/prisma"));
const pick_1 = __importDefault(require("../../../share/pick"));
const product_constant_1 = require("./product.constant");
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const client_1 = require("@prisma/client");
const createAProduct = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const files = req.files;
    const { product } = req.body;
    const imageUrls = [];
    if (files && files.length > 0) {
        for (const file of files) {
            const uploadCloudinary = yield fileUploader_1.fileUploader.uploadToCloudinary(file);
            if (uploadCloudinary === null || uploadCloudinary === void 0 ? void 0 : uploadCloudinary.secure_url) {
                imageUrls.push(uploadCloudinary.secure_url);
            }
        }
    }
    const productData = {
        name: product.name,
        price: product.price,
        description: product.description,
        inventoryCount: product.inventoryCount,
        images: imageUrls,
        discount: product.discount,
        categoryId: product.categoryId,
        vendorShopId: product.vendorShopId
    };
    const result = yield prisma_1.default.product.create({
        data: productData,
        include: {
            vendorShop: true,
            category: true,
        }
    });
    return result;
});
// update product 
const updateAProduct = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const files = req.files;
    const productId = parseInt(req.params.id);
    const imageUrls = [];
    if (files && files.length > 0) {
        for (const file of files) {
            const uploadCloudinary = yield fileUploader_1.fileUploader.uploadToCloudinary(file);
            if (uploadCloudinary === null || uploadCloudinary === void 0 ? void 0 : uploadCloudinary.secure_url) {
                imageUrls.push(uploadCloudinary.secure_url);
            }
        }
        req.body.images = imageUrls;
    }
    const productUpdateData = req.body;
    const result = yield prisma_1.default.product.update({
        where: {
            id: productId
        },
        data: productUpdateData,
    });
    return result;
});
const getAllProducts = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, product_constant_1.productFilterableFields);
    const options = (0, pick_1.default)(req.query, product_constant_1.productFilterableOptions);
    const { sortBy, sortOrder, page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm } = filters, filterData = __rest(filters, ["searchTerm"]);
    const andConditions = [{ isDeleted: false },];
    if (searchTerm) {
        const searchString = String(searchTerm);
        andConditions.push({
            OR: product_constant_1.productSearchAbleFields.map(field => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive'
                }
            }))
        });
    }
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    equals: filterData[key]
                }
            }))
        });
    }
    ;
    const whereConditons = andConditions.length > 0 ? { AND: andConditions } : {};
    const allProducts = yield prisma_1.default.product.findMany({
        where: whereConditons,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder ? {
            [options.sortBy]: options.sortOrder
        } : {
            createdAt: 'desc'
        },
        include: {
            reviews: true,
            recentProducts: true,
            category: true,
            vendorShop: true,
        }
    });
    const transformedProducts = allProducts.map((product) => ({
        id: product.id,
        name: product.name,
        images: product.images,
        price: product.price,
        inventoryCount: product.inventoryCount,
        discount: product.discount,
        category: product.category,
        flashSale: product.flashSale,
        description: product.description,
        vendorShop: product.vendorShop,
        categoryId: product.categoryId,
        vendorShopId: product.vendorShopId,
        reviews: product.reviews
    }));
    const total = yield prisma_1.default.product.count({
        where: whereConditons
    });
    return {
        paginateData: {
            total,
            limit,
            page
        },
        products: transformedProducts
    };
});
const getAllVendorProducts = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const isNotExitsVendorUser = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: (_a = req.user) === null || _a === void 0 ? void 0 : _a.email,
        },
        select: {
            id: true,
        },
    });
    const filters = (0, pick_1.default)(req.query, product_constant_1.productFilterableFields);
    const options = (0, pick_1.default)(req.query, product_constant_1.productFilterableOptions);
    const { sortBy, sortOrder, page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm } = filters, filterData = __rest(filters, ["searchTerm"]);
    const andConditions = [
        { isDeleted: false },
        { vendorShop: { ownerId: isNotExitsVendorUser.id } }
    ];
    if (searchTerm) {
        const searchString = String(searchTerm);
        andConditions.push({
            OR: product_constant_1.productSearchAbleFields.map(field => ({
                [field]: {
                    contains: searchString,
                    mode: 'insensitive'
                }
            }))
        });
    }
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    equals: filterData[key]
                }
            }))
        });
    }
    ;
    const whereConditons = andConditions.length > 0 ? { AND: andConditions } : {};
    const allProducts = yield prisma_1.default.product.findMany({
        where: whereConditons,
        skip,
        take: limit,
        orderBy: sortBy && sortOrder ? {
            [sortBy]: sortOrder
        } : {
            createdAt: 'desc'
        },
        include: {
            OrderItem: true,
            reviews: true,
            recentProducts: true,
            category: true
        }
    });
    const transformedProducts = allProducts.map((product) => ({
        id: product.id,
        name: product.name,
        images: product.images,
        price: product.price,
        inventoryCount: product.inventoryCount,
        discount: product.discount,
        category: product.category,
        categoryId: product.categoryId,
        vendorShopId: product.vendorShopId,
        flashSale: product.flashSale,
        description: product.description,
        totalOrders: product.OrderItem.length || 0,
    }));
    const total = yield prisma_1.default.product.count({
        where: whereConditons
    });
    return {
        paginateData: {
            total,
            limit,
            page
        },
        vendorAllProducts: transformedProducts
    };
});
// get a product 
const getAProduct = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = parseInt(req.params.id);
    const result = yield prisma_1.default.product.findUniqueOrThrow({
        where: {
            id: productId,
            isDeleted: false
        }
    });
    return result;
});
// Delete a product 
const deleteAProduct = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = parseInt(req.params.id);
    yield prisma_1.default.product.findUniqueOrThrow({
        where: {
            id: productId,
            isDeleted: false,
            vendorShop: {
                isDeleted: false,
                status: client_1.VendorShopStatus.ACTIVE,
            },
        },
    });
    const softDeleteProduct = yield prisma_1.default.product.update({
        where: {
            id: productId,
        },
        data: {
            isDeleted: true,
        },
    });
    return softDeleteProduct;
});
exports.productServices = {
    createAProduct,
    getAllProducts,
    getAProduct,
    deleteAProduct,
    updateAProduct,
    getAllVendorProducts
};
