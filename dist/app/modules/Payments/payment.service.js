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
Object.defineProperty(exports, "__esModule", { value: true });
exports.payServices = void 0;
const client_1 = require("@prisma/client");
const path_1 = require("path");
const fs_1 = require("fs");
const payment_utils_1 = require("./payment.utils");
const prisma = new client_1.PrismaClient();
const confirmationService = (transactionId) => __awaiter(void 0, void 0, void 0, function* () {
    const verifyResponse = yield (0, payment_utils_1.verifyPayment)(transactionId);
    let result;
    let message = '';
    if (verifyResponse && verifyResponse.pay_status === 'Successful') {
        result = yield prisma.order.updateMany({
            where: { transactionId },
            data: { paymentStatus: 'PAID' },
        });
        if (result.count > 0) {
            const updatedOrder = yield prisma.order.findFirst({
                where: { transactionId },
                select: { userId: true },
            });
            message = `Payment Successful! Transaction ID: ${transactionId}`;
        }
        else {
            message = 'Order not found or already updated.';
        }
    }
    else {
        message = 'Payment Failed!';
    }
    // Load and replace the confirmation template
    const filePath = (0, path_1.join)(__dirname, '../../../views/confirmation.html');
    console.log(filePath);
    let template = (0, fs_1.readFileSync)(filePath, 'utf-8');
    template = template.replace('{{message}}', message);
    return template;
});
exports.payServices = { confirmationService };
