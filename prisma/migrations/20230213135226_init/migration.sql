-- CreateTable
CREATE TABLE "UserHideConvo" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "convoId" INTEGER NOT NULL,
    "hide" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UserHideConvo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserHideConvo_id_key" ON "UserHideConvo"("id");

-- AddForeignKey
ALTER TABLE "UserHideConvo" ADD CONSTRAINT "UserHideConvo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserHideConvo" ADD CONSTRAINT "UserHideConvo_convoId_fkey" FOREIGN KEY ("convoId") REFERENCES "conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
