-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_convoId_fkey";

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_convoId_fkey" FOREIGN KEY ("convoId") REFERENCES "conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
