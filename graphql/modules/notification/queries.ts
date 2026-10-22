import prisma from "@/lib/prisma";

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
    { first = 20, after, unreadOnly = false }: GetNotificationsArgs,
    ctx: NotificationQueryContext,
  ) => {
    const userId = ctx.session?.user?.id;
    if (!userId) {
      throw new Error("Not authenticated");
    }

    if (!Number.isInteger(first) || first < 1 || first > 50) {
      throw new Error("Page size must be between 1 and 50");
    }

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
        ...cursorFilter,
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
      },
    });
  },
};
