import { Request } from "express";

interface CreateShopRequestBody {
    data: {
      shop: {
        name: string;
        description?: string;
        ownerId:string
        
      };
    };
  }

// Extend Request to include the custom body type
export type CreateShopRequest = Request<{}, {}, CreateShopRequestBody>;
