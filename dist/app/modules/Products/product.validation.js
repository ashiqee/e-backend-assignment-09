"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productValidation = void 0;
const zod_1 = require("zod");
const createProductSchema = zod_1.z.object({
    product: zod_1.z.object({
        name: zod_1.z.string(),
        price: zod_1.z.number(),
        description: zod_1.z.string(),
        inventoryCount: zod_1.z.number().int(),
        discount: zod_1.z.number().nullable(),
        categoryId: zod_1.z.number().int(),
        vendorShopId: zod_1.z.number().int(),
    })
});
const updateProductSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    price: zod_1.z.number().optional(),
    description: zod_1.z.string().optional(),
    inventoryCount: zod_1.z.number().int().optional(),
    discount: zod_1.z.number().nullable().optional(),
    categoryId: zod_1.z.number().int().optional(),
    vendorShopId: zod_1.z.number().int().optional(),
});
exports.productValidation = {
    createProductSchema,
    updateProductSchema,
};
