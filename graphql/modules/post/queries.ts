
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
    }
}