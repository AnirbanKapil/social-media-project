import { z } from "zod";

export const idSchema = z
  .string()
  .trim()
  .min(1, "ID is required")
  .max(100, "ID is too long");

export const cursorSchema = z
  .string()
  .trim()
  .max(4096, "Cursor is too long")
  .nullish();

export const pageSizeSchema = z.coerce
  .number()
  .int("Page size must be a whole number")
  .min(1, "Page size must be at least 1")
  .max(50, "Page size must be at most 50");

export const paginationSchema = z.object({
  first: pageSizeSchema.optional().default(10),
  after: cursorSchema,
});
