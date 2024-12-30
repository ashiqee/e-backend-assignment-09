/*
  Warnings:

  - Added the required column `vendorShopId` to the `orderItems` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "orderItems" ADD COLUMN     "vendorShopId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "_VendorShopToOrderItems" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_VendorShopToOrderItems_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_VendorShopToOrderItems_B_index" ON "_VendorShopToOrderItems"("B");

-- AddForeignKey
ALTER TABLE "orderItems" ADD CONSTRAINT "orderItems_vendorShopId_fkey" FOREIGN KEY ("vendorShopId") REFERENCES "vendorshop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_VendorShopToOrderItems" ADD CONSTRAINT "_VendorShopToOrderItems_A_fkey" FOREIGN KEY ("A") REFERENCES "orderItems"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_VendorShopToOrderItems" ADD CONSTRAINT "_VendorShopToOrderItems_B_fkey" FOREIGN KEY ("B") REFERENCES "vendorshop"("id") ON DELETE CASCADE ON UPDATE CASCADE;
