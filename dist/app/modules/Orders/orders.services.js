"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersServices = void 0;
const prisma_1 = __importDefault(require("../../../share/prisma"));
const createOrderInDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { order } = req.body;
    // Validate user
    const user = yield prisma_1.default.user.findUniqueOrThrow({
        where: { email: (_a = req.user) === null || _a === void 0 ? void 0 : _a.email },
        select: { id: true },
    });
    if (!order.cartItems || order.cartItems.length === 0) {
        throw new Error("Cart is empty. Cannot create an order.");
    }
    const { cartItems, totalPrice } = order;
    return yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        // Create the order
        const createdOrder = yield tx.order.create({
            data: {
                userId: user.id,
                totalPrice,
                fullName: order.fullName,
                mobile: order.mobile,
                address: order.address,
                paymentMethod: order.paymentMethod,
                orderItems: {
                    create: cartItems.map((item) => ({
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
            yield tx.product.update({
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
        yield tx.cartItem.deleteMany({
            where: {
                userId: user.id,
                productId: { in: cartItems.map((item) => item.productId) },
            },
        });
        return createdOrder;
    }));
});
const getOrderAllForAdmin = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // Validate user
    const user = yield prisma_1.default.user.findUniqueOrThrow({
        where: { email: (_a = req.user) === null || _a === void 0 ? void 0 : _a.email },
        select: { id: true },
    });
    const cartItems = yield prisma_1.default.cartItem.findMany({
        where: {
            userId: user.id,
        },
        include: {
            user: true,
            product: true,
        },
    });
    let subtotal = 0;
    let totalQuantity = 0;
    const itemsWithSubtotal = cartItems.map(item => {
        const itemSubtotal = item.product.price * item.quantity;
        subtotal += itemSubtotal;
        totalQuantity += item.quantity;
        return Object.assign(Object.assign({}, item), { subtotal: itemSubtotal });
    });
    return {
        cartItems: itemsWithSubtotal,
        subtotal,
        totalQuantity,
    };
});
const getCustomerOrderHistory = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = yield prisma_1.default.user.findUniqueOrThrow({
            where: { email: (_a = req.user) === null || _a === void 0 ? void 0 : _a.email },
            select: { id: true },
        });
        // Fetch the user's order history
        const orderHistory = yield prisma_1.default.order.findMany({
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
    }
    catch (error) {
        console.error("Error fetching customer order history:", error);
        throw new Error("Unable to fetch order history.");
    }
});
// Delete a product 
const cancelOrder = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const id = parseInt(req.params.id); // Assuming `productIds` is an array of product IDs
    const productIds = [id];
    try {
        // Validate user
        const user = yield prisma_1.default.user.findUniqueOrThrow({
            where: { email: (_a = req.user) === null || _a === void 0 ? void 0 : _a.email },
            select: { id: true },
        });
        // Perform the deletion within a transaction to ensure atomicity
        const cartItemDelete = yield prisma_1.default.$transaction(productIds.map((productId) => prisma_1.default.cartItem.delete({
            where: {
                userId_productId: {
                    userId: user.id,
                    productId: productId,
                },
            },
        })));
        return cartItemDelete;
    }
    catch (error) {
        throw new Error('Failed to delete cart items: ' + error);
    }
});
exports.OrdersServices = {
    createOrderInDB,
    getOrderAllForAdmin,
    cancelOrder,
    getCustomerOrderHistory,
};
