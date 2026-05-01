/*
  Warnings:

  - You are about to drop the column `explanation` on the `Budget` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Budget" DROP COLUMN "explanation",
ADD COLUMN     "technical_description" TEXT;
