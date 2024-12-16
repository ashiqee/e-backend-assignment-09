"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.userServices = void 0;
const bcrypt = __importStar(require("bcrypt"));
const prisma_1 = __importDefault(require("../../../share/prisma"));
const user_constant_1 = require("./user.constant");
const pick_1 = __importDefault(require("../../../share/pick"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const client_1 = require("@prisma/client");
const createUser = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const isNotExitsMember = yield prisma_1.default.user.findUnique({
        where: {
            email: req.body.user.email
        }
    });
    if (isNotExitsMember) {
        throw new Error("User is already exits");
    }
    const file = req.file;
    let profilePhoto = null;
    if (file) {
        profilePhoto = file.path;
    }
    const hashedPassword = yield bcrypt.hash(req.body.password, 12);
    const userData = {
        fullName: req.body.user.fullName,
        email: req.body.user.email,
        contactNumber: req.body.user.contactNumber,
        role: req.body.user.role,
        profilePhoto: profilePhoto,
        address: req.body.user.address,
        password: hashedPassword
    };
   
    const result = yield prisma_1.default.user.create({
        data: userData,
        select: {
            id: true,
            email: true,
            fullName: true,
            role: true,
            status: true,
            createdAt: true,
            updatedAt: true,
        }
    });
    return result;
});
const getAllUsers = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, user_constant_1.usersFilterableFields);
    const options = (0, pick_1.default)(req.query, user_constant_1.usersFilterableOptions);
    const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm } = filters, filterData = __rest(filters, ["searchTerm"]);
    const andConditions = [{ isDeleted: false },];
    if (searchTerm) {
        andConditions.push({
            OR: user_constant_1.usersSearchAbleFields.map(field => ({
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
    const sortBy = options.sortBy || 'createdAt';
    const sortOrder = options.sortOrder === 'desc' ? 'desc' : 'asc';
    const allUsers = yield prisma_1.default.user.findMany({
        where: whereConditons,
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder,
        },
        select: {
            id: true,
            email: true,
            fullName: true,
            role: true,
            status: true,
            profilePhoto: true,
            contactNumber: true,
            createdAt: true,
            updatedAt: true,
        }
    });
    const total = yield prisma_1.default.user.count({
        where: whereConditons
    });
    return {
        paginateData: {
            total,
            limit,
            page
        },
        data: allUsers
    };
});
const getAUsers = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            id: req.params.userId
        },
        select: {
            id: true,
            email: true,
            fullName: true,
            profilePhoto: true,
            contactNumber: true,
            address: true,
            role: true,
            status: true
        }
    });
    return user;
});
const getMyProfile = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const userInfo = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: user.email
        },
        select: {
            id: true,
            email: true,
            fullName: true,
            profilePhoto: true,
            contactNumber: true,
            address: true,
            role: true,
            status: true,
            vendorShops: true,
            orders: true,
        },
    });
    return userInfo;
});
// update user role 
// update 
const updateUser = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const file = req.file;
        // Validate input
        if (!userId) {
            throw new Error("User is Not Found");
        }
        const updateData = Object.assign({}, req.body);
        if (file) {
            updateData.profilePhoto = file.path;
        }
        // Update the user
        const updatedUser = yield prisma_1.default.user.update({
            where: { id: userId },
            data: updateData,
        });
        return updatedUser;
    }
    catch (error) {
        console.error('Error updating user:', error);
    }
});
// delete 
const deleteUser = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const isNotExitsUser = yield prisma_1.default.user.findUnique({
            where: { id: userId },
        });
        if (!isNotExitsUser) {
            throw new Error("User not found");
        }
        // Delete related data
        yield prisma_1.default.vendorShop.deleteMany({ where: { ownerId: userId } });
        // Delete the user
        const result = yield prisma_1.default.user.delete({
            where: { id: userId },
        });
        return result;
    }
    catch (err) {
        throw new Error("An error occurred while deleting the user and related data");
    }
});
const suspendUser = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isNotExitsUser = yield prisma_1.default.user.findUnique({
            where: {
                id: req.params.userId
            }
        });
        if (!isNotExitsUser) {
            throw new Error("User not found");
        }
        const result = yield prisma_1.default.user.update({
            where: {
                id: req.params.userId
            },
            data: {
                status: isNotExitsUser.status === "ACTIVE" ? client_1.UserStatus.SUSPEND : client_1.UserStatus.ACTIVE
            }
        });
        return result;
    }
    catch (err) {
        throw new Error("An error occurred while deleting the member");
    }
});
exports.userServices = {
    createUser,
    getAllUsers,
    getAUsers,
    updateUser,
    deleteUser,
    suspendUser,
    getMyProfile
};
