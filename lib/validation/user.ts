import { z } from "zod";
import { idSchema } from "./common";

export const followUserSchema = z.object({ to: idSchema });

export const updateProfileImageSchema = z.object({
  profileImgUrl: z
    .string()
    .trim()
    .url("Enter a valid image URL")
    .max(2048),
  profileImgPublicId: z.string().trim().max(255).nullish(),
});

export const getUserByUsernameSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, "Username is required")
    .max(50, "Username is too long"),
});

export const searchUsersSchema = z.object({
  keyword: z
    .string()
    .trim()
    .min(1, "Search keyword is required")
    .max(50, "Search keyword must be at most 50 characters"),
});

export const suggestedUsersSchema = z.object({
  limit: z.coerce
    .number()
    .int()
    .min(1, "Limit must be at least 1")
    .max(20, "Limit must be at most 20")
    .optional()
    .default(5),
});
