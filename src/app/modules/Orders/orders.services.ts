import { Request } from "express";
import { fileUploader } from "../../../helpers/fileUploader";
import prisma from "../../../share/prisma";
import { IFile } from "../../interfaces/file";
import { IAuthUser } from "../../interfaces/common";
import { error, log } from "console";
import pick from "../../../share/pick";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { OrderStatus, Prisma, VendorShopStatus } from "@prisma/client";



const createOrderInDB = async (req: Request & { user?: IAuthUser }) => {
    const { order } = req.body; 



    // Validate user
    const user = await prisma.user.findUniqueOrThrow({
        where: { email: req.user?.email },
        select: { id: true },
    });

    if (!order.cartItems || order.cartItems.length === 0) {
      throw new Error("Cart is empty. Cannot create an order.");
    }
  
    const { cartItems, totalPrice } = order;
    return await prisma.$transaction(async (tx) => {
      // Create the order
      const createdOrder = await tx.order.create({
          data: {
              userId: user.id,
              totalPrice,
              fullName: order.fullName,
              mobile: order.mobile,
              address: order.address,
              paymentMethod:order.paymentMethod,
              orderItems: {
                  create: cartItems.map((item: { productId: number; quantity: number; price: number }) => ({
                      productId: item.productId,
                      quantity: item.quantity,
                      price: item.price,
                  })),
              },
          },
          include: {
              orderItems: true, // Include order items in the response
          },
      });

      for (const item of cartItems) {
        await tx.product.update({
            where: { id: item.productId },
            data: {
                inventoryCount: {
                    decrement: item.quantity, 
                },
                salesQty: {
                    increment: item.quantity, 
                },
            },
        });
    }

      // Delete cart items for the user
      await tx.cartItem.deleteMany({
          where: {
              userId: user.id,
              productId: { in: cartItems.map((item: { productId: number }) => item.productId) },
          },
      });

      return createdOrder;
  });
};

const getOrderAllForAdmin = async (req: Request & { user?: IAuthUser })=>{


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

const cancelOrder = async (req: Request& {user?:IAuthUser}) => {

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
  

export const OrdersServices = {
    createOrderInDB,
    getOrderAllForAdmin,
    cancelOrder
}