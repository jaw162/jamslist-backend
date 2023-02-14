/*
  Warnings:

  - Added the required column `countyId` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "countyId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "County" (
    "name" TEXT NOT NULL,
    "abbreviation" TEXT NOT NULL,
    "country" TEXT NOT NULL,

    CONSTRAINT "County_pkey" PRIMARY KEY ("name")
);

-- CreateIndex
CREATE UNIQUE INDEX "County_name_key" ON "County"("name");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_countyId_fkey" FOREIGN KEY ("countyId") REFERENCES "County"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
