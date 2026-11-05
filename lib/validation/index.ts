import { z } from "zod";

export * from "./common";
export * from "./form";
export * from "./auth";
export * from "./post";
export * from "./comment";
export * from "./message";
export * from "./user";
export * from "./notification";

export function parseInput<S extends z.ZodType>(
  schema: S,
  data: unknown,
): z.infer<S> {
  const result = schema.safeParse(data);
  if (!result.success) {
    const issue = result.error.issues[0];
    const path = issue?.path.join(".");
    throw new Error(
      path
        ? `Invalid ${path}: ${issue.message}`
        : `Invalid input: ${issue?.message ?? "validation failed"}`,
    );
  }
  return result.data;
}

export function formatValidationErrors(
  error: z.ZodError,
): Record<string, string[]> {
  const fieldErrors: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "_";
    fieldErrors[key] ??= [];
    fieldErrors[key].push(issue.message);
  }
  return fieldErrors;
}
