"use client";

import { useCallback, useState } from "react";
import { z } from "zod";
import type { FieldErrors } from "./form";
import { zodFieldErrors } from "./form";

export function useZodForm<S extends z.ZodType>(schema: S) {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = useCallback(
    (values: z.input<S>): z.infer<S> | null => {
      const result = schema.safeParse(values);
      if (!result.success) {
        setErrors(zodFieldErrors(result.error));
        return null;
      }
      setErrors({});
      return result.data;
    },
    [schema],
  );

  const submit = useCallback(
    (values: z.input<S>): z.infer<S> | null => {
      setSubmitted(true);
      return validate(values);
    },
    [validate],
  );

  const onBlur = useCallback(
    (field: string, values: z.input<S>) => {
      setTouched((current) => ({ ...current, [field]: true }));
      const result = schema.safeParse(values);
      setErrors(result.success ? {} : zodFieldErrors(result.error));
    },
    [schema],
  );

  const clearError = useCallback((field: string) => {
    setErrors((current) => {
      if (!(field in current)) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }, []);

  const applyErrors = useCallback((fieldErrors: FieldErrors) => {
    if (Object.keys(fieldErrors).length === 0) return;
    setErrors((current) => ({ ...current, ...fieldErrors }));
    setTouched((current) => ({
      ...current,
      ...Object.fromEntries(Object.keys(fieldErrors).map((key) => [key, true])),
    }));
    setSubmitted(true);
  }, []);

  const errorFor = useCallback(
    (field: string) =>
      touched[field] || submitted ? errors[field] : undefined,
    [errors, submitted, touched],
  );

  const reset = useCallback(() => {
    setErrors({});
    setTouched({});
    setSubmitted(false);
  }, []);

  return {
    errors,
    errorFor,
    onBlur,
    clearError,
    applyErrors,
    submit,
    validate,
    reset,
  };
}
