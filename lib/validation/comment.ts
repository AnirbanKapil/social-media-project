import { z } from "zod";
import { idSchema } from "./common";

export const MAX_COMMENT_LENGTH = 1000;

export const commentContentSchema = z
  .string()
  .trim()
  .min(1, "Comment cannot be empty")
  .max(
    MAX_COMMENT_LENGTH,
    `Comment must be at most ${MAX_COMMENT_LENGTH} characters`,
  );

export const createCommentSchema = z.object({
  postId: idSchema,
  content: commentContentSchema,
});

export const deleteCommentArgsSchema = z.object({ commentId: idSchema });

export const getCommentsArgsSchema = z.object({ postId: idSchema });
