import { Request } from "express";
import prisma from "../../../share/prisma";
import pick from "../../../share/pick";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { Prisma } from "@prisma/client";
import { couponsFilterableFields, couponsFilterableOptions } from "./coupon.constant";


// Create a new coupon
const createCoupon = async (req: Request) => {
  const { code, discountPercentage, expirationDate } = req.body;

  const isExistingCoupon = await prisma.coupon.findUnique({
    where: { code },
  });

  if (isExistingCoupon) {
    throw new Error("Coupon code already exists");
  }


  const couponData = {
    code,
    discountPercentage: parseFloat(discountPercentage),
    expirationDate: new Date(expirationDate),
  };

 
  const result = await prisma.coupon.create({
    data: couponData,
  });

  return result;
};


const getAllCoupons = async (req: Request) => {
  const filters = pick(req.query, couponsFilterableFields);
  const options = pick(req.query, couponsFilterableOptions);

  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

 
  const prismaFilter: Prisma.CouponWhereInput = {};

 

  if (searchTerm && typeof searchTerm === "string") {
    prismaFilter.OR = [
      { code: { contains: searchTerm, mode: "insensitive" } },
    ];
  }
  
  if (filterData.isActive !== undefined) {
    prismaFilter.isActive = filterData.isActive === "true";
  }

  
  const result = await prisma.coupon.findMany({
    where: prismaFilter,
    skip,
    take: limit,
    orderBy: { createdAt: "desc" },
  });

  const total = await prisma.coupon.count({
    where: prismaFilter,
  });

  return {
    meta: { page, limit, total },
    data: result,
  };
};


const getCouponById = async (id: number) => {
  const result = await prisma.coupon.findUnique({
    where: { id },
  });

  if (!result) {
    throw new Error("Coupon not found");
  }

  return result;
};

// Update 
const updateCoupon = async (id: number, req: Request) => {
  const { code, discountPercentage, expirationDate, isActive } = req.body;

  const updatedData: Prisma.CouponUpdateInput = {
    code,
    discountPercentage: discountPercentage ? parseFloat(discountPercentage) : undefined,
    expirationDate: expirationDate ? new Date(expirationDate) : undefined,
    isActive: isActive !== undefined ? isActive : undefined,
  };

  const result = await prisma.coupon.update({
    where: { id },
    data: updatedData,
  });

  return result;
};

// Delete 
const deleteCoupon = async (id: number) => {
  await prisma.coupon.delete({
    where: { id },
  });

  return { message: "Coupon deleted successfully" };
};

// Validate 
const validateCoupon = async (code: string) => {
  const coupon = await prisma.coupon.findFirst({
    where: {
      code,
      isActive: true,
      expirationDate: { gte: new Date() }, 
    },
  });

  if (!coupon) {
    throw new Error("Invalid or expired coupon");
  }

  return {
    valid: true,
    discountPercentage: coupon.discountPercentage,
  };
};

export const couponServices = {
  createCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
};
