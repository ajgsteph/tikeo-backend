/*
  Warnings:

  - A unique constraint covering the columns `[linkCode]` on the table `Provider` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `linkCode` to the `Provider` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Provider" ADD COLUMN     "linkCode" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Provider_linkCode_key" ON "Provider"("linkCode");
