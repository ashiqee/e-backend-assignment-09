import { Request } from "express";

import prisma from "../../../share/prisma";
import { IFile } from "../../interfaces/file";
import { IAuthUser } from "../../interfaces/common";

import pick from "../../../share/pick";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { OrderStatus, Prisma, UserRole, VendorShopStatus } from "@prisma/client";
import { initiatePayment } from "../Payments/payment.utils";
import { ordersFilterableFields, ordersFilterableOptions, ordersSearchAbleFields } from "./orders.constant";



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
                  create: cartItems.map((item: { productId: number; quantity: number; price: number; vendorShopId: number }) => ({
                      productId: item.productId,
                      quantity: item.quantity,
                      price: item.price,
                      vendorShopId: item.vendorShopId
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
   
   
    const filters = pick(req.query, ordersFilterableFields);
    const options = pick(req.query, ordersFilterableOptions)
    const {page,limit,skip}= paginationHelper.calculatePagination(options);
    const {searchTerm , ...filterData} = filters;
    
    const user = await prisma.user.findUniqueOrThrow({
      where: { email: req.user?.email },
      select: { id: true }, 
    });

    const andConditions: Prisma.OrderWhereInput[] = [{ userId: user.id }];

    // Handle searchTerm
    if(searchTerm){
      andConditions.push({
          OR: ordersSearchAbleFields.map(field=>({
              [field]:{
                  contains: searchTerm,
                  mode: 'insensitive'
              }
          }))
      })
  }
    
    // Handle filterData
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    equals: (filterData as any)[key]  
                }
            }))
        });
    }
 
    const whereConditions: Prisma.OrderWhereInput = andConditions.length > 0 ? { AND: andConditions } : {};
    
    const sortBy = options.sortBy || 'createdAt'; 
    const sortOrder = options.sortOrder === 'desc' ? 'desc' : 'asc'; 
  
    const orderHistory = await prisma.order.findMany({
      where: whereConditions, 
      skip,
        take:limit,
        orderBy: {
            [sortBy as string]: sortOrder,
          }, 
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
       
    });
    
    const total = await prisma.order.count({
      where: whereConditions
  })
    
    return {
      paginateData:{
          total,
          limit,
          page
      },
      data: orderHistory
  };
    
  } catch (error) {
    console.error("Error fetching customer order history:", error);
    throw new Error("Unable to fetch order history.");
  }
};


const getCustomerAllOrderHistoryForAdmin = async (req: Request & { user?: IAuthUser }) => {
  try {
   
   
    const filters = pick(req.query, ordersFilterableFields);
    const options = pick(req.query, ordersFilterableOptions)
    const {page,limit,skip}= paginationHelper.calculatePagination(options);
    const {searchTerm , ...filterData} = filters;
    
    const user = await prisma.user.findUniqueOrThrow({
      where: { email: req.user?.email },
      select: { id: true }, 
    });

    const andConditions: Prisma.OrderWhereInput[] = [];

    // Handle searchTerm
    if(searchTerm){
      andConditions.push({
          OR: ordersSearchAbleFields.map(field=>({
              [field]:{
                  contains: searchTerm,
                  mode: 'insensitive'
              }
          }))
      })
  }
    
    // Handle filterData
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    equals: (filterData as any)[key]  
                }
            }))
        });
    }
 
    const whereConditions: Prisma.OrderWhereInput = andConditions.length > 0 ? { AND: andConditions } : {};
    
    const sortBy = options.sortBy || 'createdAt'; 
    const sortOrder = options.sortOrder === 'desc' ? 'desc' : 'asc'; 
  
    const orderHistory = await prisma.order.findMany({
      where: whereConditions, 
      skip,
        take:limit,
        orderBy: {
            [sortBy as string]: sortOrder,
          }, 
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
       
    });
    
    const total = await prisma.order.count({
      where: whereConditions
  })
    
    return {
      paginateData:{
          total,
          limit,
          page
      },
      data: orderHistory
  };
    
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




  const getVendorAllOrderHistory = async (req: Request & { user?: IAuthUser }) => {
    try {
     
     
      const filters = pick(req.query, ordersFilterableFields);
      const options = pick(req.query, ordersFilterableOptions)
      const {page,limit,skip,shopId}= paginationHelper.calculatePagination(options);
      const {searchTerm , ...filterData} = filters;

      
      
      const user = await prisma.user.findUniqueOrThrow({
        where: { email: req.user?.email,
                  role: UserRole.VENDOR
         },
        select: { id: true,
          vendorShops:{
            select: {
              id: true
            }
          },
         }, 
      });
  

   const shopIdInt = parseInt(shopId) || user.vendorShops[0].id;
   if(isNaN(shopIdInt)){
    throw new Error("Invalid Shop ID")
   }
   
      const andConditions: Prisma.OrderItemWhereInput[] = [{"vendorShopId": shopIdInt}];
  
      // Handle searchTerm
      if(searchTerm){
        andConditions.push({
            OR: ordersSearchAbleFields.map(field=>({  
                [field]:{
                    contains: searchTerm,
                    mode: 'insensitive'
                }
            }))
        })
    }    
  
      const whereConditions: Prisma.OrderItemWhereInput = andConditions.length > 0 ? { AND: andConditions } : {};
  
      const sortBy = options.sortBy || 'createdAt'; 
      const sortOrder = options.sortOrder === 'desc' ? 'desc' : 'asc'; 
  
      const orderHistory = await prisma.orderItem.findMany({
        where: whereConditions, 
        skip,
        take:limit,
        orderBy: {
          [sortBy as string]: sortOrder,
        }, 
        include: {
          order: true,
          product:true,
        },
      });
      
      const total = await prisma.orderItem.count({
        where: whereConditions
    })

  
    
      
      return {
        paginateData:{
            total,
            limit,
            page
        },
        data: orderHistory
    };
      
    } catch (error) {
      console.error("Error fetching customer order history:", error);
      throw new Error("Unable to fetch order history.");
    }
            }
  

export const OrdersServices = {
    createOrderInDB,
    getOrderAllForAdmin,
    cancelOrder,
    getCustomerOrderHistory,
    updateOrderStatusChange,
    createPaymentOrderInDB,
    getCustomerAllOrderHistoryForAdmin,
    getVendorAllOrderHistory
}