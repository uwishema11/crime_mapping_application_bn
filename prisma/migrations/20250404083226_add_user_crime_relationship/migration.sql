/*
  Warnings:

  - Added the required column `userId` to the `Crime` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Crime" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Crime" ADD CONSTRAINT "Crime_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
