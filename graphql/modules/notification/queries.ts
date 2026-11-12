import prisma from "@/lib/prisma";
import { getNotificationsSchema, parseInput } from "@/lib/validation";

type NotificationQueryContext = {
  session?: { user?: { id?: string | null } | null } | null;
};

type GetNotificationsArgs = {
  first?: number;
  after?: string | null;
  unreadOnly?: boolean;
};

export const notificationQueries = {
  getNotifications: async (
    _parent: unknown,
    args: GetNotificationsArgs,
    ctx: NotificationQueryContext,
  ) => {
    const userId = ctx.session?.user?.id;
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const { first, after, unreadOnly } = parseInput(getNotificationsSchema, args);

    let cursorFilter = {};
    if (after) {
      try {
        const cursor = JSON.parse(Buffer.from(after, "base64url").toString("utf8")) as {
          createdAt?: string;
          id?: string;
        };
        const createdAt = new Date(cursor.createdAt ?? "");
        if (typeof cursor.id !== "string" || !cursor.id || Number.isNaN(createdAt.getTime())) {
          throw new Error("Invalid cursor");
        }
        cursorFilter = {
          OR: [
            { createdAt: { lt: createdAt } },
            { AND: [{ createdAt }, { id: { lt: cursor.id } }] },
          ],
        };
      } catch {
        throw new Error("Invalid notification cursor");
      }
    }

    const rows = await prisma.notification.findMany({
      where: {
        recipientId: userId,
        ...(unreadOnly ? { readAt: null } : {}),
        AND: [
          cursorFilter,
          { actor: { is: { accountStatus: "ACTIVE" } } },
          {
            OR: [
              { postId: null },
              { post: { is: { isHidden: false } } },
            ],
          },
        ],
      },
      include: {
        actor: true,
        post: { include: { author: true } },
        comment: true,
      },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: first + 1,
    });

    const hasMore = rows.length > first;
    const notifications = hasMore ? rows.slice(0, first) : rows;
    const lastNotification = notifications.at(-1);
    const nextCursor = hasMore && lastNotification
      ? Buffer.from(JSON.stringify({
          createdAt: lastNotification.createdAt.toISOString(),
          id: lastNotification.id,
        })).toString("base64url")
      : null;

    return { notifications, nextCursor, hasMore };
  },

  unreadNotificationCount: async (
    _parent: unknown,
    _args: unknown,
    ctx: NotificationQueryContext,
  ) => {
    const userId = ctx.session?.user?.id;
    if (!userId) {
      throw new Error("Not authenticated");
    }

    return prisma.notification.count({
      where: {
        recipientId: userId,
        readAt: null,
        AND: [
          { actor: { is: { accountStatus: "ACTIVE" } } },
          {
            OR: [
              { postId: null },
              { post: { is: { isHidden: false } } },
            ],
          },
        ],
      },
    });
  },

  unseenNotificationCount: async (
    _parent: unknown,
    _args: unknown,
    ctx: NotificationQueryContext,
  ) => {
    const userId = ctx.session?.user?.id;
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { notificationsSeenAt: true },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return prisma.notification.count({
      where: {
        recipientId: userId,
        readAt: null,
        AND: [
          { actor: { is: { accountStatus: "ACTIVE" } } },
          {
            OR: [
              { postId: null },
              { post: { is: { isHidden: false } } },
            ],
          },
        ],
        ...(user.notificationsSeenAt
          ? { createdAt: { gt: user.notificationsSeenAt } }
          : {}),
      },
    });
  },
};
