import { z } from "zod";

export type FieldErrors = Record<string, string>;

export function zodFieldErrors(error: z.ZodError): FieldErrors {
  const fieldErrors: FieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "_";
    if (!(key in fieldErrors)) {
      fieldErrors[key] = issue.message;
    }
  }
  return fieldErrors;
}

export function serverFieldErrors(payload: unknown): FieldErrors {
  if (!payload || typeof payload !== "object") return {};

  const raw = (payload as { errors?: unknown }).errors;
  if (!raw || typeof raw !== "object") return {};

  const fieldErrors: FieldErrors = {};
  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    if (Array.isArray(value)) {
      const first = value.find((item) => typeof item === "string");
      if (typeof first === "string") {
        fieldErrors[key] = first;
      }
    } else if (typeof value === "string") {
      fieldErrors[key] = value;
    }
  }
  return fieldErrors;
}

export function mergeFieldErrors(...groups: FieldErrors[]): FieldErrors {
  return Object.assign({}, ...groups);
}
