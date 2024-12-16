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
exports.vendorShopServices = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../../share/prisma"));
const pick_1 = __importDefault(require("../../../share/pick"));
const vendorshop_constant_1 = require("./vendorshop.constant");
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const createShop = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    const shopData = req.body.shop;
    const user = req.user;
    const userInfo = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: user === null || user === void 0 ? void 0 : user.email,
            status: "ACTIVE"
        }
    });
    let logo = null;
    if (file) {
        logo = file.path;
    }
    const vendorShopData = {
        name: shopData.name,
        logo: logo,
        description: shopData.description,
        ownerId: userInfo.id
    };
    const result = yield prisma_1.default.vendorShop.create({
        data: vendorShopData,
        include: {
            owner: {
                select: {
                    fullName: true,
                    email: true,
                    profilePhoto: true,
                }
            }
        }
    });
    return result;
});
// updateshop info 
const updateVendorShop = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const vendorShopId = parseInt(req.params.id); // Convert string to number
    if (isNaN(vendorShopId)) {
        throw new Error("Invalid vendor shop ID");
    }
    const updateData = Object.assign({}, req.body);
    const file = req.file;
    if (file) {
        updateData.logo = file.path;
    }
    // updateVendorShop 
    const updateVenshop = yield prisma_1.default.vendorShop.update({
        where: { id: vendorShopId },
        data: updateData,
    });
    return updateVenshop;
});
// for addmin 
const getAllShop = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, vendorshop_constant_1.vendorShopFilterableFields);
    const options = (0, pick_1.default)(req.query, vendorshop_constant_1.vendorShopFilterableOptions);
    const { sortBy, sortOrder, page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm } = filters, filterData = __rest(filters, ["searchTerm"]);
    const andConditions = [{ isDeleted: false },];
    if (searchTerm) {
        andConditions.push({
            OR: vendorshop_constant_1.vendorShopSearchAbleFields.map(field => ({
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
    const allShops = yield prisma_1.default.vendorShop.findMany({
        where: whereConditons,
        skip,
        take: limit,
        orderBy: sortBy && sortOrder ? {
            [sortBy]: sortOrder
        } : {
            createdAt: 'desc'
        },
        include: {
            owner: true,
            products: true
        }
    });
    const transformedShops = allShops.map((shop) => {
        var _a, _b;
        return ({
            id: shop.id,
            name: shop.name,
            logo: shop.logo,
            status: shop.status,
            ownerName: ((_a = shop.owner) === null || _a === void 0 ? void 0 : _a.fullName) || "N/A",
            contactNumber: ((_b = shop.owner) === null || _b === void 0 ? void 0 : _b.contactNumber) || "N/A",
            totalProducts: shop.products.length || 0,
        });
    });
    const total = yield prisma_1.default.vendorShop.count({
        where: whereConditons
    });
    return {
        paginateData: {
            total,
            limit,
            page
        },
        data: transformedShops
    };
});
// for vendor 
const getMyAllShop = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const isNotExitsUser = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: (_a = req.user) === null || _a === void 0 ? void 0 : _a.email,
            role: "VENDOR"
        },
        select: {
            id: true,
        },
    });
    const filters = (0, pick_1.default)(req.query, vendorshop_constant_1.vendorShopFilterableFields);
    const options = (0, pick_1.default)(req.query, vendorshop_constant_1.vendorShopFilterableOptions);
    const { sortBy, sortOrder, page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm } = filters, filterData = __rest(filters, ["searchTerm"]);
    const andConditions = [
        { isDeleted: false },
        { ownerId: isNotExitsUser.id },
    ];
    console.log(searchTerm);
    if (searchTerm) {
        const searchString = String(searchTerm);
        andConditions.push({
            OR: [
                ...vendorshop_constant_1.vendorShopSearchAbleFields.map((field) => ({
                    [field]: {
                        contains: searchString,
                        mode: 'insensitive',
                    },
                })),
                {
                    products: {
                        some: {
                            OR: [
                                {
                                    name: {
                                        contains: searchString,
                                        mode: 'insensitive',
                                    },
                                },
                                {
                                    category: {
                                        name: {
                                            contains: searchString,
                                            mode: 'insensitive',
                                        },
                                    },
                                },
                            ],
                        },
                    },
                },
            ],
        });
    }
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: {
                    equals: filterData[key],
                },
            })),
        });
    }
    const whereConditons = andConditions.length > 0 ? { AND: andConditions } : {};
    const allShops = yield prisma_1.default.vendorShop.findMany({
        where: whereConditons,
        skip,
        take: limit,
        orderBy: sortBy && sortOrder
            ? {
                [sortBy]: sortOrder,
            }
            : {
                createdAt: "desc",
            },
        include: {
            products: {
                include: {
                    category: true,
                    OrderItem: {
                        include: {
                            product: true,
                            order: true
                        },
                    }
                },
            },
            followers: true,
        },
    });
    const allProducts = allShops.flatMap((shop) => shop.products);
    const productsWithCategoryName = allProducts.map((product) => {
        var _a;
        return (Object.assign(Object.assign({}, product), { categoryName: ((_a = product.category) === null || _a === void 0 ? void 0 : _a.name) || "Uncategorized" }));
    });
    const transformedShops = allShops.map((shop) => ({
        id: shop.id,
        name: shop.name,
        logo: shop.logo,
        description: shop.description,
        status: shop.status,
        totalProducts: shop.products.length || 0,
        totalFollowers: shop.followers.length || 0,
    }));
    const total = yield prisma_1.default.vendorShop.count({
        where: whereConditons,
    });
    return {
        paginateData: {
            total,
            limit,
            page,
        },
        shops: transformedShops,
        products: productsWithCategoryName,
        orders: allShops.flatMap((shop) => shop.products.flatMap((product) => product.OrderItem)),
    };
});
const deleteVendorShop = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const shopId = parseInt(req.params.shopId);
        const isNotExitsVendorShop = yield prisma_1.default.vendorShop.findUnique({
            where: {
                id: shopId,
                isDeleted: false
            }
        });
        if (!isNotExitsVendorShop) {
            throw new Error("Shop not found");
        }
        const result = yield prisma_1.default.vendorShop.update({
            where: {
                id: shopId
            },
            data: {
                isDeleted: true
            }
        });
        return result;
    }
    catch (err) {
        throw new Error("An error occurred while deleting the member");
    }
});
const getShopByVendorId = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const shopId = parseInt(req.params.id);
    const result = yield prisma_1.default.vendorShop.findUniqueOrThrow({
        where: {
            id: shopId,
            status: client_1.VendorShopStatus.ACTIVE,
            isDeleted: false
        },
        include: {
            products: {
                include: {
                    OrderItem: true,
                }
            },
            followers: true,
        }
    });
    return result;
});
const blacklistShop = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const shopId = parseInt(req.params.shopId);
    const existVendorShop = yield prisma_1.default.vendorShop.findUniqueOrThrow({
        where: {
            id: shopId,
            isDeleted: false,
        }
    });
    if (!existVendorShop) {
        throw new Error("Vendor SHop Not Exits");
    }
    const blackListResult = yield prisma_1.default.vendorShop.update({
        where: {
            id: shopId
        },
        data: {
            status: existVendorShop.status === client_1.VendorShopStatus.ACTIVE ? client_1.VendorShopStatus.BLACKLISTED : client_1.VendorShopStatus.ACTIVE
        }
    });
    return blackListResult;
});
exports.vendorShopServices = {
    createShop,
    getAllShop,
    updateVendorShop,
    getShopByVendorId,
    deleteVendorShop,
    blacklistShop,
    getMyAllShop
};
