
import prisma from "@/lib/prisma";

export const postQueries = {
    getPostById: async (_parent: unknown, { postId }: { postId: string }) => {
      return prisma.post.findUnique({
        where: { id: postId },
        include: { author: true },
      });
    },

    getAllPosts: async (
      _parent: unknown,
      { first = 10, after }: { first?: number; after?: string | null },
    ) => {
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
          throw new Error("Invalid post cursor");
        }
      }

      const rows = await prisma.post.findMany({
        where: cursorFilter,
        include: { author: true },
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        take: first + 1,
      });

      const hasMore = rows.length > first;
      const posts = hasMore ? rows.slice(0, first) : rows;
      const lastPost = posts.at(-1);
      const nextCursor = hasMore && lastPost
        ? Buffer.from(JSON.stringify({
            createdAt: lastPost.createdAt.toISOString(),
            id: lastPost.id,
          })).toString("base64url")
        : null;

      return { posts, nextCursor, hasMore };
    },

    getBookmarkedPosts: async (
      _parent: unknown,
      { first = 10, after }: { first?: number; after?: string | null },
      ctx: { session?: { user?: { id: string } } | null },
    ) => {
      if (!ctx.session?.user) {
        throw new Error("Not authenticated!!");
      }
      const userId = ctx.session.user.id;

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
              { AND: [{ createdAt }, { postId: { lt: cursor.id } }] },
            ],
          };
        } catch {
          throw new Error("Invalid post cursor");
        }
      }

      const rows = await prisma.bookmark.findMany({
        where: { userId, ...cursorFilter },
        include: { post: { include: { author: true } } },
        orderBy: [{ createdAt: "desc" }, { postId: "desc" }],
        take: first + 1,
      });

      const hasMore = rows.length > first;
      const slice = hasMore ? rows.slice(0, first) : rows;
      const posts = slice.map((row) => row.post);
      const lastBookmark = slice.at(-1);
      const nextCursor = hasMore && lastBookmark
        ? Buffer.from(JSON.stringify({
            createdAt: lastBookmark.createdAt.toISOString(),
            id: lastBookmark.postId,
          })).toString("base64url")
        : null;

      return { posts, nextCursor, hasMore };
    }
}