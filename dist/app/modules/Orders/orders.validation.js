"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ordersValidation = void 0;
const zod_1 = require("zod");
const createOrderSchema = zod_1.z.object({
    order: zod_1.z.object({
        cartItems: zod_1.z
            .array(zod_1.z.object({
            productId: zod_1.z.number().int().positive("Product ID must be a positive integer"),
            quantity: zod_1.z.number().int().min(1, "Quantity must be at least 1"),
            price: zod_1.z.number().nonnegative("Price must be a non-negative number"),
            vendorShopId: zod_1.z.number().int().positive("Vendor Shop ID must be a positive integer"),
        }))
            .min(1, "Cart must contain at least one item"),
        totalPrice: zod_1.z.number().positive("Total price must be a positive number"),
        fullName: zod_1.z.string().min(1, "Full name is required"),
        mobile: zod_1.z.string().min(1, "Mobile number is required"),
        address: zod_1.z.string().min(1, "Address is required"),
        paymentMethod: zod_1.z.string().optional()
    }),
});
exports.ordersValidation = {
    createOrderSchema,
};
