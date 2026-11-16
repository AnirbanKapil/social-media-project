-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "likeCount" INTEGER NOT NULL DEFAULT 0;

-- Backfill from existing likes
UPDATE "Post" p
SET "likeCount" = counts.total
FROM (
    SELECT "postId", COUNT(*)::INTEGER AS total
    FROM "Like"
    GROUP BY "postId"
) counts
WHERE counts."postId" = p."id";

-- CreateIndex
CREATE INDEX "Post_likeCount_id_idx" ON "Post"("likeCount", "id");
