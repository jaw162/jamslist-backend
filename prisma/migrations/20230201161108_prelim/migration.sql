/*
  Warnings:

  - Added the required column `slug` to the `County` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "County" ADD COLUMN     "slug" TEXT NOT NULL;
