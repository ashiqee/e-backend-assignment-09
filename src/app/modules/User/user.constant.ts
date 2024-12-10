
// export enum UserStatus {
//     ACTIVE = 'ACTIVE',
//     INACTIVE = 'INACTIVE',
//     BANNED = 'BANNED',
//   }
  
//   export enum UserRole {
//     ADMIN = 'ADMIN',
//     CUSTOMER = 'CUSTOMER',
//     VENDOR = 'VENDOR',
//   }

export const usersSearchAbleFields: string[] = [
    'fullName',
    'contactNumber',
    // 'status', // Enum field as string
    // 'role',
];


export const usersFilterableOptions: string[] = [
    'limit',
    'page',
    'sortBy',
    'sortOrder',
  ];


export const usersFilterableFields: string[] = [
      'searchTerm'
]; 