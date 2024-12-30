"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ordersFilterableOptions = exports.ordersFilterableFields = exports.ordersSearchAbleFields = void 0;
exports.ordersSearchAbleFields = [
    'id',
    "name",
    'description',
]; // only for search term
exports.ordersFilterableFields = [
    'searchTerm'
]; // for all filtering 
exports.ordersFilterableOptions = [
    'limit',
    'page',
    'sortBy',
    'sortOrder',
    'shopId',
];
