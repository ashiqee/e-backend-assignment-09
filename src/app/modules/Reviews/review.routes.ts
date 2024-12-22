import express, { Request, Response, NextFunction } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { reviewController } from "./review.controler";


const router = express.Router();

router.post(
  "/create",
  auth(UserRole.CUSTOMER),
  reviewController.createReview
);

router.get(
  "/",
  auth(UserRole.CUSTOMER, UserRole.ADMIN),
reviewController.getReviewById
);

router.put(
  "/:id",
  auth(UserRole.CUSTOMER),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      // Update review details logic here
      res.json({ message: `Review with ID ${id} updated successfully.` });
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/:id",
  auth(UserRole.ADMIN),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      // Delete review logic here
      res.json({ message: `Review with ID ${id} deleted successfully.` });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/",
  auth(UserRole.CUSTOMER, UserRole.ADMIN),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, limit, searchTerm } = req.query;
      // Fetch reviews logic here
      res.json({
        message: "Reviews fetched successfully.",
        data: { page, limit, searchTerm },
      });
    } catch (error) {
      next(error);
    }
  }
);

export const ReviewRoutes = router;
