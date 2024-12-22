import { Request } from "express";
import prisma from "../../../share/prisma";
import pick from "../../../share/pick";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { Prisma } from "@prisma/client";
import { reviewsFilterableFields, reviewsFilterableOptions } from "./review.constant";
import { IAuthUser } from "../../interfaces/common";

// Create a new review
const createReview = async (req: Request & {user?:IAuthUser}) => {


  const exitsUser = await prisma.user.findUniqueOrThrow({
    where: {
      email: req.user?.email,
      role: "CUSTOMER"
    },
    select: {
      id: true,
    },
  });




  const { rating, comment, productId, userId } = req.body;

  const reviewData = {
    rating: parseInt(rating, 10),
    comment,
    productId: parseInt(productId, 10),
    userId: exitsUser.id,
  };



  const result = await prisma.review.create({
    data: reviewData,
  });

  return result;
};

// Get all reviews with optional filters
const getAllReviews = async (req: Request) => {
  const filters = pick(req.query, reviewsFilterableFields);
  const options = pick(req.query, reviewsFilterableOptions);

  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const prismaFilter: Prisma.ReviewWhereInput = {};

  if (searchTerm && typeof searchTerm === "string") {
    prismaFilter.OR = [
      { comment: { contains: searchTerm, mode: "insensitive" } },
    ];
  }

  if (filterData.productId) {
    prismaFilter.productId = parseInt(filterData.productId as string, 10);
  }

  const result = await prisma.review.findMany({
    where: prismaFilter,
    skip,
    take: limit,
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { fullName: true } },
      product: { select: { name: true } },
    },
  });

  const total = await prisma.review.count({
    where: prismaFilter,
  });

  return {
    meta: { page, limit, total },
    data: result,
  };
};

// Get a single review by ID
const getReviewByUserId = async (req:Request & {user?:IAuthUser}) => {

  const exitsUser = await prisma.user.findUniqueOrThrow({
    where: {
      email: req.user?.email,
      role: "CUSTOMER"
    },
    select: {
      id: true,
    },
  });

  const userId = exitsUser.id as string


  const result = await prisma.review.findMany({
    where: { userId: userId },
    include: {
      user: { select: { fullName: true } },
      product: {
         select: { 
        name: true,
        images:true,
        id:true,
       } },
    },
  });

  if (!result) {
    throw new Error("Review not found");
  }

  return result;
};

// Update a review
const updateReview = async (id: number, req: Request) => {
  const { rating, comment } = req.body;

  const updatedData: Prisma.ReviewUpdateInput = {
    rating: rating ? parseInt(rating, 10) : undefined,
    comment: comment || undefined,
  };

  const result = await prisma.review.update({
    where: { id },
    data: updatedData,
  });

  return result;
};

// Delete a review
const deleteReview = async (id: number) => {
  await prisma.review.delete({
    where: { id },
  });

  return { message: "Review deleted successfully" };
};

// Validate a review for a specific user and product
const validateReview = async (userId: string, productId: number) => {
  const existingReview = await prisma.review.findFirst({
    where: { userId, productId },
  });

  if (existingReview) {
    throw new Error("You have already reviewed this product");
  }

  return { valid: true };
};

export const reviewServices = {
  createReview,
  getAllReviews,
  getReviewByUserId,
  updateReview,
  deleteReview,
  validateReview,
};
