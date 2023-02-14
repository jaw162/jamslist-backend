/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `County` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "County_country_key";

-- CreateIndex
CREATE UNIQUE INDEX "County_slug_key" ON "County"("slug");
