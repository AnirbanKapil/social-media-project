-- AlterTable
ALTER TABLE "ConversationParticipant" ADD COLUMN     "lastReadAt" TIMESTAMP(3);

-- Backfill: treat existing conversations as already read so users are not flooded with old unread messages
UPDATE "ConversationParticipant" SET "lastReadAt" = NOW();
