/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `VendorShop` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "VendorShop_name_key" ON "VendorShop"("name");
