import httpStatus from "http-status";
import catchAsync from "../../../share/catchAsync";
import sendResponse from "../../../share/sendResponse";
import { reviewServices } from "./review.service";
import { Request, Response } from "express";

const createReview = catchAsync(async (req: Request, res: Response) => {
  const result = await reviewServices.createReview(req);

  sendResponse(res, {
    success: true,
    status: httpStatus.CREATED,
    message: "Review created successfully",
    data: result,
  });
});

const getAllReviews = catchAsync(async (req: Request, res: Response) => {
  const result = await reviewServices.getAllReviews(req);

  sendResponse(res, {
    success: true,
    status: httpStatus.OK,
    message: "Reviews retrieved successfully",
    data: result,
  });
});

const getReviewById = catchAsync(async (req: Request, res: Response) => {

  const result = await reviewServices.getReviewByUserId(req);

  sendResponse(res, {
    success: true,
    status: httpStatus.OK,
    message: "Review retrieved successfully",
    data: result,
  });
});

const updateReview = catchAsync(async (req: Request, res: Response) => {
  const reviewId = Number(req.params.id);
  const result = await reviewServices.updateReview(reviewId, req);

  sendResponse(res, {
    success: true,
    status: httpStatus.OK,
    message: "Review updated successfully",
    data: result,
  });
});

const deleteReview = catchAsync(async (req: Request, res: Response) => {
  const reviewId = Number(req.params.id);
  const result = await reviewServices.deleteReview(reviewId);

  sendResponse(res, {
    success: true,
    status: httpStatus.OK,
    message: "Review deleted successfully",
    data: result,
  });
});

export const reviewController = {
  createReview,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview,
};
