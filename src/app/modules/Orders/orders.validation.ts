
import { z } from "zod";

const createOrderSchema = z.object({
  order: z.object({
    cartItems: z
      .array(
        z.object({
          productId: z.number().int().positive("Product ID must be a positive integer"),
          quantity: z.number().int().min(1, "Quantity must be at least 1"),
          price: z.number().nonnegative("Price must be a non-negative number"),
          vendorShopId: z.number().int().positive("Vendor Shop ID must be a positive integer"),
        })
      )
      .min(1, "Cart must contain at least one item"),
    totalPrice: z.number().positive("Total price must be a positive number"),
    fullName: z.string().min(1, "Full name is required"),
    mobile: z.string().min(1, "Mobile number is required"),
    address: z.string().min(1, "Address is required"),
    paymentMethod:z.string().optional()
  }),
});



export const ordersValidation = {
    createOrderSchema,
    
    
}