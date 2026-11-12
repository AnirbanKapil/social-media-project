import prisma from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";
import { deleteResetTokensForUser } from "@/lib/passwordReset";

const DELETION_GRACE_PERIOD_MS = 7 * 24 * 60 * 60 * 1000;

export async function requestAccountDeletion(userId: string): Promise<Date> {
  const now = new Date();
  const deletionScheduledAt = new Date(now.getTime() + DELETION_GRACE_PERIOD_MS);

  await prisma.$transaction(async (tx) => {
    const updated = await tx.user.updateMany({
      where: { id: userId, accountStatus: "ACTIVE" },
      data: {
        accountStatus: "PENDING_DELETION",
        deletionRequestedAt: now,
        deletionScheduledAt,
      },
    });

    if (updated.count !== 1) {
      throw new Error("Account is not eligible for deletion");
    }

    await tx.post.updateMany({
      where: { authorId: userId },
      data: { isHidden: true },
    });
  });

  return deletionScheduledAt;
}

export async function cancelPendingAccountDeletion(userId: string): Promise<boolean> {
  return prisma.$transaction(async (tx) => {
    const updated = await tx.user.updateMany({
      where: {
        id: userId,
        accountStatus: "PENDING_DELETION",
        deletionScheduledAt: { gt: new Date() },
      },
      data: {
        accountStatus: "ACTIVE",
        deletionRequestedAt: null,
        deletionScheduledAt: null,
      },
    });

    if (updated.count !== 1) {
      return false;
    }

    await tx.post.updateMany({
      where: { authorId: userId },
      data: { isHidden: false },
    });

    return true;
  });
}

export async function finalizeAccountDeletion(userId: string): Promise<boolean> {
  const now = new Date();
  const claimed = await prisma.user.updateMany({
    where: {
      id: userId,
      accountStatus: "PENDING_DELETION",
      deletionScheduledAt: { lte: now },
    },
    data: { accountStatus: "DELETING" },
  });

  if (claimed.count !== 1) {
    const account = await prisma.user.findUnique({
      where: { id: userId },
      select: { accountStatus: true },
    });
    if (account?.accountStatus !== "DELETING") {
      return false;
    }
  }

  const account = await prisma.user.findUnique({
    where: { id: userId },
    select: { accountStatus: true, profileImgPublicId: true },
  });
  if (account?.accountStatus !== "DELETING") {
    return false;
  }

  await deleteResetTokensForUser(userId);

  if (account.profileImgPublicId) {
    await cloudinary.uploader.destroy(account.profileImgPublicId);
  }

  await prisma.$transaction(async (tx) => {
    await tx.like.deleteMany({ where: { userId } });
    await tx.bookmark.deleteMany({ where: { userId } });
    await tx.follows.deleteMany({
      where: { OR: [{ followerId: userId }, { followingId: userId }] },
    });
    await tx.notification.deleteMany({
      where: {
        OR: [
          { recipientId: userId },
          { actorId: userId },
          { post: { is: { authorId: userId } } },
          { comment: { is: { authorId: userId } } },
        ],
      },
    });
    const ownedGroups = await tx.conversationParticipant.findMany({
      where: {
        userId,
        role: "OWNER",
        leftAt: null,
        conversation: { isGroup: true },
      },
      select: { conversationId: true },
    });

    for (const { conversationId } of ownedGroups) {
      const successors = await tx.conversationParticipant.findMany({
        where: {
          conversationId,
          leftAt: null,
          userId: { not: userId },
        },
        orderBy: { joinedAt: "asc" },
        select: { userId: true, role: true },
      });

      if (successors.length === 0) {
        await tx.conversation.delete({ where: { id: conversationId } });
        continue;
      }

      const successor =
        successors.find((member) => member.role === "ADMIN") ?? successors[0];

      await tx.conversationParticipant.update({
        where: {
          conversationId_userId: {
            conversationId,
            userId: successor.userId,
          },
        },
        data: { role: "OWNER" },
      });
    }

    await tx.conversationParticipant.deleteMany({ where: { userId } });
    await tx.user.update({
      where: { id: userId },
      data: {
        accountStatus: "DELETED",
        email: `deleted-${userId}@deleted.invalid`,
        username: `deleted-${userId}`,
        password: null,
        firstName: null,
        lastName: null,
        profileImgUrl: null,
        profileImgPublicId: null,
        notificationsSeenAt: null,
      },
    });
  });

  return true;
}
