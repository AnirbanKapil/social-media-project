import type { Prisma } from "@/app/generated/prisma/client";

export type PostVisibility = "PUBLIC" | "FOLLOWERS" | "PRIVATE";

/**
 * Builds the Prisma filter that limits posts to those the viewer may see.
 *
 * Note: the `User.followers` / `User.followings` relation names in
 * `schema.prisma` are semantically swapped. The relation used below
 * (`author.followings`) resolves to `Follows` rows where the author is the
 * followed user, so `followerId: viewerId` means "viewer follows author".
 */
export function buildVisibilityWhere(
  viewerId: string | null | undefined,
): Prisma.PostWhereInput {
  if (!viewerId) {
    return { visibility: "PUBLIC" };
  }

  return {
    OR: [
      { visibility: "PUBLIC" },
      { authorId: viewerId },
      {
        visibility: "FOLLOWERS",
        author: {
          followings: {
            some: { followerId: viewerId },
          },
        },
      },
    ],
  };
}

/**
 * Full visibility filter for feeds/queries: hides deleted/hidden authors and
 * ensures reposts only surface when the original post is visible too.
 */
export function buildVisiblePostWhere(
  viewerId: string | null | undefined,
): Prisma.PostWhereInput {
  const visibility = buildVisibilityWhere(viewerId);

  return {
    isHidden: false,
    author: { accountStatus: "ACTIVE" },
    AND: [
      visibility,
      {
        OR: [
          { repostOfId: null },
          {
            repostOf: {
              is: {
                isHidden: false,
                author: { accountStatus: "ACTIVE" },
                ...visibility,
              },
            },
          },
        ],
      },
    ],
  };
}
