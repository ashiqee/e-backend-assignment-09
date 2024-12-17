import express, { Request, Response, NextFunction } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import multer from "multer";
import { couponController } from "./coupon.controler";

const upload = multer(); // Initialize Multer middleware
const router = express.Router();


router.post(
  "/create",
  auth(UserRole.VENDOR),
  couponController.createCoupon
);


router.get(
  "/:id",
  auth(UserRole.VENDOR, UserRole.ADMIN),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      // Fetch coupon details logic here
      res.json({ message: `Coupon with ID ${id} retrieved successfully.` });
    } catch (error) {
      next(error);
    }
  }
);


router.put(
  "/:id",
  auth(UserRole.VENDOR),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      // Update coupon details logic here
      res.json({ message: `Coupon with ID ${id} updated successfully.` });
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
      // Delete coupon logic here
      res.json({ message: `Coupon with ID ${id} deleted successfully.` });
    } catch (error) {
      next(error);
    }
  }
);


router.get(
  "/",
  auth(UserRole.VENDOR, UserRole.ADMIN),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, limit, searchTerm } = req.query;
     
      res.json({
        message: "Coupons fetched successfully.",
        data: { page, limit, searchTerm },
      });
    } catch (error) {
      next(error);
    }
  }
);

export const CouponRoutes = router;
