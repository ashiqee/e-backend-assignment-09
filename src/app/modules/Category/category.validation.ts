
import { z } from "zod";

const createCategorySchema = z.object({
   
    category: z.object({
        name: z.string(),
        description: z.string().optional(),
       
    })
});

const updateCategorySchema = z.object({
        name: z.string().optional(),
        description: z.string().optional(),
        
});

export const categoryValidation = {
    createCategorySchema,
    updateCategorySchema,
    
}