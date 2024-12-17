import { Request } from "express";

import prisma from "../../../share/prisma";
import { IFile } from "../../interfaces/file";
import { IAuthUser } from "../../interfaces/common";

import pick from "../../../share/pick";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { OrderStatus, Prisma, VendorShopStatus } from "@prisma/client";
import { initiatePayment } from "../Payments/payment.utils";



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

const createPaymentOrderInDB = async (req: Request & { user?: IAuthUser }) => {
  const { order } = req.body;
  const transactionId = `txn-${Date.now()}`;
 

  // Validate user
  const user = await prisma.user.findUniqueOrThrow({
    where: { email: req.user?.email },
    select: {
      id: true,
      email: true,
      fullName: true,
      address: true,
      contactNumber: true,
    },
  });

  if (!order.cartItems || order.cartItems.length === 0) {
    throw new Error("Cart is empty. Cannot create an order.");
  }

  const { cartItems, totalPrice } = order;


  const paymentData = {
    transactionId,
    totalPrice,
    customerName: user.fullName,
    customerEmail: user.email,
    customerPhone: user.contactNumber,
    customerAddress: user.address,
  };

  

 
  // Step 2: Begin database transaction after payment success
  return await prisma.$transaction(async (tx) => {
    // Create the order with "Paid" status
    const createdOrder = await tx.order.create({
      data: {
        userId: user.id,
        totalPrice,
        fullName: order.fullName,
        mobile: order.mobile,
        address: order.address,
        transactionId: transactionId,
        paymentMethod: order.paymentMethod,
        orderItems: {
          create: cartItems.map(
            (item: { productId: number; quantity: number; price: number }) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })
          ),
        },
      },
      include: { orderItems: true },
    });
   
    

    // Update inventory and sales quantity
    for (const item of cartItems) {
      await tx.product.update({
        where: { id: item.productId },
        data: {
          inventoryCount: { decrement: item.quantity },
          salesQty: { increment: item.quantity },
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


 // Step 
  const paymentSession = await initiatePayment(paymentData);


   
    

    return paymentSession;
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


const getCustomerOrderHistory = async (req: Request & { user?: IAuthUser }) => {
  try {
   
    const user = await prisma.user.findUniqueOrThrow({
      where: { email: req.user?.email },
      select: { id: true }, 
    });

    // Fetch the user's order history
    const orderHistory = await prisma.order.findMany({
      where: { userId: user.id }, 
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                images: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" }, 
    });

    
    return orderHistory;
  } catch (error) {
    console.error("Error fetching customer order history:", error);
    throw new Error("Unable to fetch order history.");
  }
};





// Delete a product 

const cancelOrder = async (req: Request& {user?:IAuthUser}) => {

    const id = parseInt(req.params.id);  // Assuming `productIds` is an array of product IDs
  
const productIds = [id]


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
  
const updateOrderStatusChange = async (req: Request& {user?:IAuthUser}) => {

    const id = parseInt(req.params.id);  
   const status = req.body.status





    try {

          // Validate user
    const user = await prisma.user.findUniqueOrThrow({
        where: { email: req.user?.email },
        select: { id: true },
    });


const result = await prisma.orderItem.update({
  where:{
    id:id
  },
  data:{
    orderStatus: status
  }
})
  
      return result;
    } catch (error) {
      throw new Error('Failed to delete cart items: ' + error);
    }
  };
  

export const OrdersServices = {
    createOrderInDB,
    getOrderAllForAdmin,
    cancelOrder,
    getCustomerOrderHistory,
    updateOrderStatusChange,
    createPaymentOrderInDB
}