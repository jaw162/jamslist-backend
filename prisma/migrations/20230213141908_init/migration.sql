-- DropForeignKey
ALTER TABLE "UserHideConvo" DROP CONSTRAINT "UserHideConvo_convoId_fkey";

-- AddForeignKey
ALTER TABLE "UserHideConvo" ADD CONSTRAINT "UserHideConvo_convoId_fkey" FOREIGN KEY ("convoId") REFERENCES "conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
