
import { z } from "zod";

const createProductSchema = z.object({
   
    product: z.object({
        name: z.string(),
        price: z.number(),
        description: z.string(),
        inventoryCount: z.number().int(),
        discount: z.number().nullable(),
        categoryId: z.number().int(),
        vendorShopId: z.number().int(),
    })
});

const updateProductSchema = z.object({
        name: z.string().optional(),
        price: z.number().optional(),
        description: z.string().optional(),
        inventoryCount: z.number().int().optional(),
        discount: z.number().nullable().optional(),
        categoryId: z.number().int().optional(),
        vendorShopId: z.number().int().optional(),
})


export const productValidation = {
    createProductSchema,
    updateProductSchema,
    
}