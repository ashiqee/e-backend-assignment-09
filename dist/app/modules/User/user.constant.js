"use strict";
// export enum UserStatus {
//     ACTIVE = 'ACTIVE',
//     INACTIVE = 'INACTIVE',
//     BANNED = 'BANNED',
//   }
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersFilterableFields = exports.usersFilterableOptions = exports.usersSearchAbleFields = void 0;
//   export enum UserRole {
//     ADMIN = 'ADMIN',
//     CUSTOMER = 'CUSTOMER',
//     VENDOR = 'VENDOR',
//   }
exports.usersSearchAbleFields = [
    'fullName',
    'contactNumber',
];
exports.usersFilterableOptions = [
    'limit',
    'page',
    'sortBy',
    'sortOrder',
];
exports.usersFilterableFields = [
    'searchTerm'
];
