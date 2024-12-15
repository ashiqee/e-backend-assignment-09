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
exports.cartItemServices = void 0;
const prisma_1 = __importDefault(require("../../../share/prisma"));
const addToCartInDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let { cart } = req.body; // Use 'let' for reassignment
    if (!Array.isArray(cart)) {
        cart = [cart];
    }
    // Validate cart
    if (cart.length === 0) {
        throw new Error("Cart must be a non-empty array.");
    }
    // Validate user
    const user = yield prisma_1.default.user.findUniqueOrThrow({
        where: { email: (_a = req.user) === null || _a === void 0 ? void 0 : _a.email },
        select: { id: true },
    });
    // Prepare cart data and process with upsert
    const results = yield prisma_1.default.$transaction(cart.map((item) => prisma_1.default.cartItem.upsert({
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
    })));
    return results;
});
const getCartItems = (req) => __awaiter(void 0, void 0, void 0, function* () {
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
// Delete a product 
const deleteCartsItem = (req) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.cartItemServices = {
    addToCartInDB,
    getCartItems,
    deleteCartsItem
};
