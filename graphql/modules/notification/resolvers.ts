import prisma from "@/lib/prisma";
import { notificationQueries } from "./queries";

type NotificationResolverContext = {
  session?: { user?: { id?: string | null } | null } | null;
};

export const notificationResolvers = {
  Mutation: {
    markNotificationRead: async (
      _parent: unknown,
      { notificationId }: { notificationId: string },
      ctx: NotificationResolverContext,
    ) => {
      const userId = ctx.session?.user?.id;
      if (!userId) {
        throw new Error("Not authenticated");
      }

      const notification = await prisma.notification.findFirst({
        where: {
          id: notificationId,
          recipientId: userId,
        },
      });

      if (!notification) {
        return false;
      }

      if (!notification.readAt) {
        await prisma.notification.update({
          where: { id: notification.id },
          data: { readAt: new Date() },
        });
      }

      return true;
    },

    markAllNotificationsRead: async (
      _parent: unknown,
      _args: unknown,
      ctx: NotificationResolverContext,
    ) => {
      const userId = ctx.session?.user?.id;
      if (!userId) {
        throw new Error("Not authenticated");
      }

      await prisma.notification.updateMany({
        where: {
          recipientId: userId,
          readAt: null,
        },
        data: { readAt: new Date() },
      });

      return true;
    },
  },

  Query: notificationQueries,
};
