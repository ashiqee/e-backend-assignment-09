
import { z } from "zod";

const addTocartSchema = z.object({
       cart: z.object({
        productId: z.number().int().optional(),
        quantity: z.number().int().optional(),
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


export const cartsValidation = {
    addTocartSchema,
    updateProductSchema,
    
}