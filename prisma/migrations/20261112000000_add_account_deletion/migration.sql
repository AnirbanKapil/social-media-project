CREATE TYPE "AccountStatus" AS ENUM ('ACTIVE', 'PENDING_DELETION', 'DELETING', 'DELETED');

ALTER TABLE "User"
ADD COLUMN "accountStatus" "AccountStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN "deletionRequestedAt" TIMESTAMP(3),
ADD COLUMN "deletionScheduledAt" TIMESTAMP(3);

ALTER TABLE "Post"
ADD COLUMN "isHidden" BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX "User_accountStatus_deletionScheduledAt_idx"
ON "User"("accountStatus", "deletionScheduledAt");
