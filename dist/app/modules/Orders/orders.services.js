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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersServices = void 0;
const prisma_1 = __importDefault(require("../../../share/prisma"));
const pick_1 = __importDefault(require("../../../share/pick"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const client_1 = require("@prisma/client");
const payment_utils_1 = require("../Payments/payment.utils");
const orders_constant_1 = require("./orders.constant");
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
                        vendorShopId: item.vendorShopId
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
const createPaymentOrderInDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { order } = req.body;
    const transactionId = `txn-${Date.now()}`;
    // Validate user
    const user = yield prisma_1.default.user.findUniqueOrThrow({
        where: { email: (_a = req.user) === null || _a === void 0 ? void 0 : _a.email },
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
    return yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        // Create the order with "Paid" status
        const createdOrder = yield tx.order.create({
            data: {
                userId: user.id,
                totalPrice,
                fullName: order.fullName,
                mobile: order.mobile,
                address: order.address,
                transactionId: transactionId,
                paymentMethod: order.paymentMethod,
                orderItems: {
                    create: cartItems.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price,
                    })),
                },
            },
            include: { orderItems: true },
        });
        // Update inventory and sales quantity
        for (const item of cartItems) {
            yield tx.product.update({
                where: { id: item.productId },
                data: {
                    inventoryCount: { decrement: item.quantity },
                    salesQty: { increment: item.quantity },
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
        // Step 
        const paymentSession = yield (0, payment_utils_1.initiatePayment)(paymentData);
        return paymentSession;
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
        const filters = (0, pick_1.default)(req.query, orders_constant_1.ordersFilterableFields);
        const options = (0, pick_1.default)(req.query, orders_constant_1.ordersFilterableOptions);
        const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
        const { searchTerm } = filters, filterData = __rest(filters, ["searchTerm"]);
        const user = yield prisma_1.default.user.findUniqueOrThrow({
            where: { email: (_a = req.user) === null || _a === void 0 ? void 0 : _a.email },
            select: { id: true },
        });
        const andConditions = [{ userId: user.id }];
        // Handle searchTerm
        if (searchTerm) {
            andConditions.push({
                OR: orders_constant_1.ordersSearchAbleFields.map(field => ({
                    [field]: {
                        contains: searchTerm,
                        mode: 'insensitive'
                    }
                }))
            });
        }
        // Handle filterData
        if (Object.keys(filterData).length > 0) {
            andConditions.push({
                AND: Object.keys(filterData).map(key => ({
                    [key]: {
                        equals: filterData[key]
                    }
                }))
            });
        }
        const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
        const sortBy = options.sortBy || 'createdAt';
        const sortOrder = options.sortOrder === 'desc' ? 'desc' : 'asc';
        const orderHistory = yield prisma_1.default.order.findMany({
            where: whereConditions,
            skip,
            take: limit,
            orderBy: {
                [sortBy]: sortOrder,
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
        const total = yield prisma_1.default.order.count({
            where: whereConditions
        });
        return {
            paginateData: {
                total,
                limit,
                page
            },
            data: orderHistory
        };
    }
    catch (error) {
        console.error("Error fetching customer order history:", error);
        throw new Error("Unable to fetch order history.");
    }
});
const getCustomerAllOrderHistoryForAdmin = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const filters = (0, pick_1.default)(req.query, orders_constant_1.ordersFilterableFields);
        const options = (0, pick_1.default)(req.query, orders_constant_1.ordersFilterableOptions);
        const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
        const { searchTerm } = filters, filterData = __rest(filters, ["searchTerm"]);
        const user = yield prisma_1.default.user.findUniqueOrThrow({
            where: { email: (_a = req.user) === null || _a === void 0 ? void 0 : _a.email },
            select: { id: true },
        });
        const andConditions = [];
        // Handle searchTerm
        if (searchTerm) {
            andConditions.push({
                OR: orders_constant_1.ordersSearchAbleFields.map(field => ({
                    [field]: {
                        contains: searchTerm,
                        mode: 'insensitive'
                    }
                }))
            });
        }
        // Handle filterData
        if (Object.keys(filterData).length > 0) {
            andConditions.push({
                AND: Object.keys(filterData).map(key => ({
                    [key]: {
                        equals: filterData[key]
                    }
                }))
            });
        }
        const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
        const sortBy = options.sortBy || 'createdAt';
        const sortOrder = options.sortOrder === 'desc' ? 'desc' : 'asc';
        const orderHistory = yield prisma_1.default.order.findMany({
            where: whereConditions,
            skip,
            take: limit,
            orderBy: {
                [sortBy]: sortOrder,
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
        const total = yield prisma_1.default.order.count({
            where: whereConditions
        });
        return {
            paginateData: {
                total,
                limit,
                page
            },
            data: orderHistory
        };
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
const updateOrderStatusChange = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const id = parseInt(req.params.id);
    const status = req.body.status;
    try {
        // Validate user
        const user = yield prisma_1.default.user.findUniqueOrThrow({
            where: { email: (_a = req.user) === null || _a === void 0 ? void 0 : _a.email },
            select: { id: true },
        });
        const result = yield prisma_1.default.orderItem.update({
            where: {
                id: id
            },
            data: {
                orderStatus: status
            }
        });
        return result;
    }
    catch (error) {
        throw new Error('Failed to delete cart items: ' + error);
    }
});
const getVendorAllOrderHistory = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const filters = (0, pick_1.default)(req.query, orders_constant_1.ordersFilterableFields);
        const options = (0, pick_1.default)(req.query, orders_constant_1.ordersFilterableOptions);
        const { page, limit, skip, shopId } = paginationHelper_1.paginationHelper.calculatePagination(options);
        const { searchTerm } = filters, filterData = __rest(filters, ["searchTerm"]);
        const user = yield prisma_1.default.user.findUniqueOrThrow({
            where: { email: (_a = req.user) === null || _a === void 0 ? void 0 : _a.email,
                role: client_1.UserRole.VENDOR },
            select: { id: true,
                vendorShops: {
                    select: {
                        id: true
                    }
                },
            },
        });
        const shopIdInt = parseInt(shopId) || user.vendorShops[0].id;
        if (isNaN(shopIdInt)) {
            throw new Error("Invalid Shop ID");
        }
        const andConditions = [{ "vendorShopId": shopIdInt }];
        // Handle searchTerm
        if (searchTerm) {
            andConditions.push({
                OR: orders_constant_1.ordersSearchAbleFields.map(field => ({
                    [field]: {
                        contains: searchTerm,
                        mode: 'insensitive'
                    }
                }))
            });
        }
        const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
        const sortBy = options.sortBy || 'createdAt';
        const sortOrder = options.sortOrder === 'desc' ? 'desc' : 'asc';
        const orderHistory = yield prisma_1.default.orderItem.findMany({
            where: whereConditions,
            skip,
            take: limit,
            orderBy: {
                [sortBy]: sortOrder,
            },
            include: {
                order: true,
                product: true,
            },
        });
        const total = yield prisma_1.default.orderItem.count({
            where: whereConditions
        });
        return {
            paginateData: {
                total,
                limit,
                page
            },
            data: orderHistory
        };
    }
    catch (error) {
        console.error("Error fetching customer order history:", error);
        throw new Error("Unable to fetch order history.");
    }
});
exports.OrdersServices = {
    createOrderInDB,
    getOrderAllForAdmin,
    cancelOrder,
    getCustomerOrderHistory,
    updateOrderStatusChange,
    createPaymentOrderInDB,
    getCustomerAllOrderHistoryForAdmin,
    getVendorAllOrderHistory
};
