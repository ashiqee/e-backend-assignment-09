

import { z } from "zod";

const createShop = z.object({
    password: z.string({
        required_error: "Password is required"
    }),
    user: z.object({
        fullName: z.string({
            required_error: "Full Name is required!"
        }),
        email: z.string({
            required_error: "Email is required!"
        }),
        contactNumber: z.string().optional(),
        address: z.string().optional(),
        role: z.string({
            required_error: "Role is required!"
          })
    })
});

const udateShop = z.object({
        fullName: z.string().optional(),
        contactNumber: z.string().optional(),
        address: z.string().optional(),   
});



export const shopValidation = {
    createShop,
    udateShop,
    
}