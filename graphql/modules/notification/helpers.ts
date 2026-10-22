import prisma from "@/lib/prisma";
import type { NotificationType } from "@/app/generated/prisma/enums";

type CreateNotificationInput = {
  type: NotificationType;
  recipientId: string;
  actorId: string;
  postId?: string | null;
  commentId?: string | null;
};

type DeleteNotificationInput = {
  type: NotificationType;
  actorId: string;
  recipientId?: string | null;
  postId?: string | null;
};

export async function createNotification(input: CreateNotificationInput) {
  if (input.recipientId === input.actorId) {
    return null;
  }

  try {
    return await prisma.notification.create({
      data: {
        type: input.type,
        recipientId: input.recipientId,
        actorId: input.actorId,
        postId: input.postId ?? null,
        commentId: input.commentId ?? null,
      },
    });
  } catch (error) {
    console.error("Failed to create notification:", error);
    return null;
  }
}

export async function deleteNotification(input: DeleteNotificationInput) {
  try {
    await prisma.notification.deleteMany({
      where: {
        type: input.type,
        actorId: input.actorId,
        ...(input.recipientId ? { recipientId: input.recipientId } : {}),
        ...(input.postId ? { postId: input.postId } : {}),
      },
    });
  } catch (error) {
    console.error("Failed to delete notification:", error);
  }
}
