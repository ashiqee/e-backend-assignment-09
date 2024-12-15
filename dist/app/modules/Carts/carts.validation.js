"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartsValidation = void 0;
const zod_1 = require("zod");
const addTocartSchema = zod_1.z.object({
    cart: zod_1.z.object({
        productId: zod_1.z.number().int().optional(),
        quantity: zod_1.z.number().int().optional(),
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
exports.cartsValidation = {
    addTocartSchema,
    updateProductSchema,
};
