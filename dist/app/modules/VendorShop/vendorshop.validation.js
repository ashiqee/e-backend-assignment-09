"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shopValidation = void 0;
const zod_1 = require("zod");
const createShopSchema = zod_1.z.object({
    shop: zod_1.z.object({
        name: zod_1.z.string({
            required_error: "Shop Name is required!",
        }),
        description: zod_1.z.string().optional(),
    }),
});
const updateShopSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
});
exports.shopValidation = {
    createShopSchema,
    updateShopSchema,
};
