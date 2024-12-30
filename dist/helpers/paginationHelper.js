"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginationHelper = void 0;
const calculatePagination = (options) => {
    const page = Number(options.page) || 1;
    const limit = Number(options.limit) || 20;
    const skip = (Number(page) - 1) * limit;
    const shopId = options.shopId || '';
    const sortBy = options.sortBy || 'createdAt';
    const sortOrder = options.sortOrder || 'desc';
    return {
        page,
        limit,
        skip,
        sortBy,
        sortOrder,
        shopId,
    };
};
exports.paginationHelper = {
    calculatePagination
};
