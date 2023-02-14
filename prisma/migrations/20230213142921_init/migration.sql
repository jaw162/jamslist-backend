/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `UserHideConvo` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[convoId]` on the table `UserHideConvo` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserHideConvo_userId_key" ON "UserHideConvo"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserHideConvo_convoId_key" ON "UserHideConvo"("convoId");
