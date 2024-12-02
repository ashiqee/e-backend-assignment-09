
import { z } from "zod";

const createUser = z.object({
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
        role: z.string({
            required_error: "Role is required!"
          })
    })
});

export const userValidation = {
    createUser,
    
}