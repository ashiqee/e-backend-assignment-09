import { Request } from "express";
import { fileUploader } from "../../../helpers/fileUploader";
import prisma from "../../../share/prisma";
import { IFile } from "../../interfaces/file";
import { IAuthUser } from "../../interfaces/common";
import { error, log } from "console";
import pick from "../../../share/pick";
import { productFilterableFields, productFilterableOptions, productSearchAbleFields } from "./carts.constant";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { Prisma, VendorShopStatus } from "@prisma/client";



const addToCartInDB = async (req: Request & { user?: IAuthUser }) => {
    let { cart } = req.body; // Use 'let' for reassignment


    if (!Array.isArray(cart)) {
        cart = [cart];
    }

    // Validate cart
    if (cart.length === 0) {
        throw new Error("Cart must be a non-empty array.");
    }

    // Validate user
    const user = await prisma.user.findUniqueOrThrow({
        where: { email: req.user?.email },
        select: { id: true },
    });

    // Prepare cart data and process with upsert
    const results = await prisma.$transaction(
        cart.map((item:any) =>
            prisma.cartItem.upsert({
                where: {
                    userId_productId: { userId: user.id, productId: item.productId },
                },
                update: {
                    quantity: {
                        increment: item.quantity, 
                    },
                },
                create: {
                    userId: user.id,
                    productId: item.productId,
                    quantity: item.quantity, 
                },
                
            })
        )
    );

    return results;
};


const getCartItems = async (req: Request & { user?: IAuthUser })=>{


    // Validate user
    const user = await prisma.user.findUniqueOrThrow({
        where: { email: req.user?.email },
        select: { id: true },
    });

      
const cartItems = await prisma.cartItem.findMany({
    where: {
        userId: user.id,        
    },
    include: {
            user: true,
            product: true,
        },
    
})

let subtotal = 0;
let totalQuantity = 0;

const itemsWithSubtotal = cartItems.map(item => {
    const itemSubtotal = item.product.price * item.quantity;  
    subtotal += itemSubtotal;  
    totalQuantity += item.quantity;  

    return {
      ...item,
      subtotal: itemSubtotal, 
    };
  })

  return {
    cartItems: itemsWithSubtotal,
    subtotal,      
    totalQuantity, 
  };

}







// Delete a product 

const deleteCartsItem = async (req: Request& {user?:IAuthUser}) => {

    const id = parseInt(req.params.id);  // Assuming `productIds` is an array of product IDs
  
const productIds = [id]
console.log(id);

    try {

          // Validate user
    const user = await prisma.user.findUniqueOrThrow({
        where: { email: req.user?.email },
        select: { id: true },
    });



      // Perform the deletion within a transaction to ensure atomicity
      const cartItemDelete = await prisma.$transaction(
        productIds.map((productId: number) =>
          prisma.cartItem.delete({
            where: {
              userId_productId: {
                userId: user.id,
                productId: productId,
              },
            },
          })
        )
      );
  
      return cartItemDelete;
    } catch (error) {
      throw new Error('Failed to delete cart items: ' + error);
    }
  };
  

export const cartItemServices = {
    addToCartInDB,
    getCartItems,
    deleteCartsItem
}