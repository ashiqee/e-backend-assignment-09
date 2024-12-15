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
exports.CategoryServices = void 0;
const fileUploader_1 = require("../../../helpers/fileUploader");
const prisma_1 = __importDefault(require("../../../share/prisma"));
const pick_1 = __importDefault(require("../../../share/pick"));
const category_constant_1 = require("./category.constant");
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const createACategory = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { category } = req.body;
    const isNotExitsCategory = yield prisma_1.default.category.findUnique({
        where: { name: category.name },
    });
    if (isNotExitsCategory) {
        throw new Error("Category already exists");
    }
    const file = req.file;
    let image = null;
    if (file) {
        const uploadCloudinary = yield fileUploader_1.fileUploader.uploadToCloudinary(file);
        image = (uploadCloudinary === null || uploadCloudinary === void 0 ? void 0 : uploadCloudinary.secure_url) || null;
    }
    const CategoryData = {
        name: category.name,
        description: category.description,
        image: image
    };
    const result = yield prisma_1.default.category.create({
        data: CategoryData,
    });
    return result;
});
const getAllCategoryFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.category.findMany({
        where: {
            isDeleted: false,
        },
        include: {
            products: true,
        },
    });
    return result;
});
const getAllCategory = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, category_constant_1.categoriesFilterableFields);
    const options = (0, pick_1.default)(req.query, category_constant_1.categoriesFilterableOptions);
    const { sortBy, sortOrder, page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm } = filters, filterData = __rest(filters, ["searchTerm"]);
    const andConditions = [{ isDeleted: false },];
    if (searchTerm) {
        andConditions.push({
            OR: category_constant_1.categoriesSearchAbleFields.map(field => ({
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
    const allCategories = yield prisma_1.default.category.findMany({
        where: whereConditons,
        skip,
        take: limit,
        orderBy: sortBy && sortOrder ? {
            [sortBy]: sortOrder
        } : {
            createdAt: 'desc'
        },
        include: {
            products: true
        }
    });
    const transformedCategories = allCategories.map((cat) => ({
        id: cat.id,
        name: cat.name,
        logo: cat.image,
        description: cat.description,
        totalProducts: cat.products.length || 0,
    }));
    const total = yield prisma_1.default.category.count({
        where: whereConditons
    });
    return {
        paginateData: {
            total,
            limit,
            page
        },
        data: transformedCategories
    };
});
const deleteCategory = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categoryId = parseInt(req.params.categoryId);
        const isNotExitscategory = yield prisma_1.default.category.findUnique({
            where: { id: categoryId },
        });
        if (!isNotExitscategory) {
            throw new Error("category not found");
        }
        // Update related data
        yield prisma_1.default.product.updateMany({
            where: { categoryId: categoryId },
            data: {
                categoryId: 1 //1 mean other category
            }
        });
        // Delete the category
        const result = yield prisma_1.default.category.update({
            where: { id: categoryId },
            data: {
                isDeleted: true
            }
        });
        return result;
    }
    catch (err) {
        throw new Error("An error occurred while deleting the category and related data");
    }
});
const updateCategory = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categoryId = parseInt(req.params.categoryId);
        const isNotExitsCategory = yield prisma_1.default.category.findUnique({
            where: { id: categoryId },
        });
        if (!isNotExitsCategory) {
            throw new Error("Category not found");
        }
        const file = req.file;
        // Upload profile photo if provided
        let image = null;
        if (file) {
            const uploadCloudinary = yield fileUploader_1.fileUploader.uploadToCloudinary(file);
            image = (uploadCloudinary === null || uploadCloudinary === void 0 ? void 0 : uploadCloudinary.secure_url) || null;
        }
        const updateData = Object.assign({}, req.body);
        if (image) {
            updateData.image = image;
        }
        // Update the Category
        const updatedCategory = yield prisma_1.default.category.update({
            where: { id: categoryId },
            data: updateData,
        });
        return updatedCategory;
    }
    catch (error) {
        console.error('Error updating Category:', error);
    }
});
const getOnlyCategory = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categoryId = parseInt(req.params.categoryId);
        const category = yield prisma_1.default.category.findUnique({
            where: { id: categoryId },
            include: {
                products: true
            }
        });
        return category;
    }
    catch (error) {
        console.error('Error fetching Category:', error);
    }
});
exports.CategoryServices = {
    createACategory,
    getAllCategory,
    deleteCategory,
    updateCategory,
    getOnlyCategory,
    getAllCategoryFromDB
};
