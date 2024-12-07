

import { z } from "zod";

const createShopSchema = z.object({
    shop: z.object({
      name: z.string({
        required_error: "Shop Name is required!",
      }),
      description: z.string().optional(),
      ownerId: z.string({
        required_error: "Shop Name is required!",
      }),
    }),
  });



const updateShop = z.object({
        name: z.string().optional(),
        description: z.string().optional(),
        
});



export const shopValidation = {
    createShopSchema,
    updateShop,
    
}