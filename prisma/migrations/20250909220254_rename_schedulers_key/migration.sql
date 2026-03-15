/*
  Warnings:

  - You are about to drop the column `available` on the `Schedule` table. All the data in the column will be lost.
  - You are about to drop the column `dayOfWeek` on the `Schedule` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[serviceId,startTime,endTime]` on the table `Schedule` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Schedule" DROP COLUMN "available",
DROP COLUMN "dayOfWeek",
ADD COLUMN     "isBooked" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "Schedule_serviceId_startTime_endTime_key" ON "Schedule"("serviceId", "startTime", "endTime");
