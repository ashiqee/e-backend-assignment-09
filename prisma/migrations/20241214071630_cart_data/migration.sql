/*
  Warnings:

  - A unique constraint covering the columns `[userId,productId]` on the table `cartItems` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "cartItems_userId_productId_key" ON "cartItems"("userId", "productId");
