/*
  Warnings:

  - You are about to drop the column `location` on the `Crime` table. All the data in the column will be lost.
  - You are about to drop the column `reportedAt` on the `Crime` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Crime` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Crime` table. All the data in the column will be lost.
  - Added the required column `createdBy` to the `Crime` table without a default value. This is not possible if the table is not empty.
  - Added the required column `crime_name` to the `Crime` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('PENDING', 'UNDER_REVIEW', 'INVESTIGATING', 'RESOLVED', 'REJECTED');

-- DropForeignKey
ALTER TABLE "Crime" DROP CONSTRAINT "Crime_userId_fkey";

-- AlterTable
ALTER TABLE "Crime" DROP COLUMN "location",
DROP COLUMN "reportedAt",
DROP COLUMN "title",
DROP COLUMN "userId",
ADD COLUMN     "createdBy" INTEGER NOT NULL,
ADD COLUMN     "crime_name" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Report" (
    "id" SERIAL NOT NULL,
    "crimeName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "incidentDate" TIMESTAMP(3) NOT NULL,
    "reportedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "ReportStatus" NOT NULL DEFAULT 'PENDING',
    "evidence" TEXT,
    "contactNumber" TEXT,
    "categoryName" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Crime" ADD CONSTRAINT "Crime_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_categoryName_fkey" FOREIGN KEY ("categoryName") REFERENCES "CrimeCategory"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
