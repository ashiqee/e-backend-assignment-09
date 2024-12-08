
import { z } from "zod";

const createCategorySchema = z.object({
   
    category: z.object({
        name: z.string(),
       
    })
});

const updateProductSchema = z.object({
        fullName: z.string().optional(),
        contactNumber: z.string().optional(),
        address: z.string().optional(),   
});

export const categoryValidation = {
    createCategorySchema,
    updateProductSchema,
    
}