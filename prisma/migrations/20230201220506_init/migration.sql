/*
  Warnings:

  - A unique constraint covering the columns `[country]` on the table `County` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "County_country_key" ON "County"("country");
