-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('UNPAID', 'PAID');

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'UNPAID',
ALTER COLUMN "orderStatus" SET DEFAULT 'PENDING';
