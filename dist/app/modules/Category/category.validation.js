"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryValidation = void 0;
const zod_1 = require("zod");
const createCategorySchema = zod_1.z.object({
    category: zod_1.z.object({
        name: zod_1.z.string(),
        description: zod_1.z.string().optional(),
    })
});
const updateCategorySchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
});
exports.categoryValidation = {
    createCategorySchema,
    updateCategorySchema,
};
