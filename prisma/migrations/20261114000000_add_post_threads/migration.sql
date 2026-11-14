-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "threadRootId" TEXT,
ADD COLUMN     "threadPosition" INTEGER;

-- CreateIndex
CREATE INDEX "Post_threadRootId_threadPosition_idx" ON "Post"("threadRootId", "threadPosition");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_threadRootId_fkey" FOREIGN KEY ("threadRootId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
