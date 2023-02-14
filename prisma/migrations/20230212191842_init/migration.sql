/*
  Warnings:

  - You are about to drop the column `title` on the `Message` table. All the data in the column will be lost.
  - Added the required column `title` to the `conversation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Message" DROP COLUMN "title";

-- AlterTable
ALTER TABLE "conversation" ADD COLUMN     "title" TEXT NOT NULL;
