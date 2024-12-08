
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
        fullName: z.string().optional(),
        contactNumber: z.string().optional(),
        address: z.string().optional(),   
});

export const productValidation = {
    createProductSchema,
    updateProductSchema,
    
}