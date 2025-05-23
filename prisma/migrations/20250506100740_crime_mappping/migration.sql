/*
  Warnings:

  - Added the required column `category_author` to the `CrimeCategory` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `CrimeCategory` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "CrimeCategoryStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'BLOCKED');

-- AlterTable
ALTER TABLE "CrimeCategory" ADD COLUMN     "category_author" TEXT NOT NULL,
ADD COLUMN     "status" "CrimeCategoryStatus" NOT NULL DEFAULT 'ACTIVE',
ALTER COLUMN "description" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "CrimeCategory" ADD CONSTRAINT "CrimeCategory_category_author_fkey" FOREIGN KEY ("category_author") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
