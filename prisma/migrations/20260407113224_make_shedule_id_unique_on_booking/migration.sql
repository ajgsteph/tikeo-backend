/*
  Warnings:

  - The `status` column on the `Booking` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `ServiceId` on the `Customer` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[scheduleId]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `serviceId` to the `Customer` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED');

-- DropForeignKey
ALTER TABLE "Customer" DROP CONSTRAINT "Customer_serviceId_fkey";

-- DropIndex
DROP INDEX "Customer_providerId_idx";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "status",
ADD COLUMN     "status" "BookingStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "ServiceId",
ADD COLUMN     "serviceId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Booking_scheduleId_key" ON "Booking"("scheduleId");

-- CreateIndex
CREATE INDEX "Customer_serviceId_idx" ON "Customer"("serviceId");

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
