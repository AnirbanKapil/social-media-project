
import type { Prisma } from "@/app/generated/prisma/client";
import prisma from "@/lib/prisma";
import {
  parseInput,
  postIdArgsSchema,
  postPaginationSchema,
} from "@/lib/validation";

const visiblePostFilter: Prisma.PostWhereInput = {
  isHidden: false,
  author: { accountStatus: "ACTIVE" },
  OR: [
    { repostOfId: null },
    {
      repostOf: {
        is: { isHidden: false, author: { accountStatus: "ACTIVE" } },
      },
    },
  ],
};

export const postQueries = {
    getPostById: async (_parent: unknown, args: { postId: string }) => {
      const { postId } = parseInput(postIdArgsSchema, args);

      return prisma.post.findFirst({
        where: { id: postId, ...visiblePostFilter },
        include: { author: true },
      });
    },

    getAllPosts: async (
      _parent: unknown,
      args: { first?: number; after?: string | null },
    ) => {
      const { first, after } = parseInput(postPaginationSchema, args);

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
        where: { AND: [visiblePostFilter, cursorFilter] },
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

    getMediaPosts: async (
      _parent: unknown,
      args: { first?: number; after?: string | null },
    ) => {
      const { first, after } = parseInput(postPaginationSchema, args);

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

      const mediaFilter = {
        OR: [
          { imgURLs: { isEmpty: false } },
          { imgURL: { not: null } },
        ],
      };

      const rows = await prisma.post.findMany({
        where: { AND: [visiblePostFilter, mediaFilter, cursorFilter] },
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
      args: { first?: number; after?: string | null },
      ctx: { session?: { user?: { id: string } } | null },
    ) => {
      if (!ctx.session?.user) {
        throw new Error("Not authenticated!!");
      }
      const userId = ctx.session.user.id;

      const { first, after } = parseInput(postPaginationSchema, args);

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
        where: {
          userId,
          AND: [cursorFilter, { post: visiblePostFilter }],
        },
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