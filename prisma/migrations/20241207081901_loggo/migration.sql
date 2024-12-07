/*
  Warnings:

  - You are about to drop the column `logoUrl` on the `vendorshop` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "vendorshop" DROP COLUMN "logoUrl",
ADD COLUMN     "logo" TEXT;

-- CreateIndex
CREATE INDEX "vendorshop_name_idx" ON "vendorshop"("name");
