/*
  Warnings:

  - You are about to drop the column `isDelected` on the `products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "products" DROP COLUMN "isDelected",
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;
