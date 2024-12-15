"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidation = void 0;
const zod_1 = require("zod");
const createUser = zod_1.z.object({
    password: zod_1.z.string({
        required_error: "Password is required"
    }),
    user: zod_1.z.object({
        fullName: zod_1.z.string({
            required_error: "Full Name is required!"
        }),
        email: zod_1.z.string({
            required_error: "Email is required!"
        }),
        contactNumber: zod_1.z.string().optional(),
        address: zod_1.z.string().optional(),
        role: zod_1.z.string({
            required_error: "Role is required!"
        })
    })
});
const updateUser = zod_1.z.object({
    fullName: zod_1.z.string().optional(),
    contactNumber: zod_1.z.string().optional(),
    address: zod_1.z.string().optional(),
});
exports.userValidation = {
    createUser,
    updateUser,
};
