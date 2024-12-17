import httpStatus from "http-status";
import catchAsync from "../../../share/catchAsync";
import sendResponse from "../../../share/sendResponse";
import { couponServices } from "./coupon.service";
import { Request, Response } from "express";


const createCoupon = catchAsync(async (req: Request, res: Response) => {
  const result = await couponServices.createCoupon(req);

  sendResponse(res, {
    success: true,
    status: httpStatus.CREATED,
    message: "Coupon created successfully",
    data: result,
  });
});


const getAllCoupons = catchAsync(async (req: Request, res: Response) => {
  const result = await couponServices.getAllCoupons(req);

  sendResponse(res, {
    success: true,
    status: httpStatus.OK,
    message: "Coupons retrieved successfully",
    data: result.data,
   
  });
});


const getCouponById = catchAsync(async (req: Request, res: Response) => {
  const couponId = Number(req.params.id);
  const result = await couponServices.getCouponById(couponId);

  sendResponse(res, {
    success: true,
    status: httpStatus.OK,
    message: "Coupon retrieved successfully",
    data: result,
  });
});


const updateCoupon = catchAsync(async (req: Request, res: Response) => {
  const couponId = Number(req.params.id);
  const result = await couponServices.updateCoupon(couponId, req.body);

  sendResponse(res, {
    success: true,
    status: httpStatus.OK,
    message: "Coupon updated successfully",
    data: result,
  });
});


const deleteCoupon = catchAsync(async (req: Request, res: Response) => {
  const couponId = Number(req.params.id);
  const result = await couponServices.deleteCoupon(couponId);

  sendResponse(res, {
    success: true,
    status: httpStatus.OK,
    message: "Coupon deleted successfully",
    data: result,
  });
});

export const couponController = {
  createCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
};
