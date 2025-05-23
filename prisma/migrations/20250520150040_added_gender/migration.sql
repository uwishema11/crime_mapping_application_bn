/*
  Warnings:

  - Made the column `description` on table `Crime` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FRMALE');

-- AlterTable
ALTER TABLE "Crime" ALTER COLUMN "description" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "city" TEXT,
ADD COLUMN     "date_of_birth" TIMESTAMP(3),
ADD COLUMN     "gender" "Gender",
ADD COLUMN     "image_url" TEXT NOT NULL DEFAULT 'https://www.creativefabrica.com/wp-content/uploads/2022/10/25/Person-icon-Graphics-43204353-1.jpg',
ALTER COLUMN "phone_number" DROP NOT NULL;
