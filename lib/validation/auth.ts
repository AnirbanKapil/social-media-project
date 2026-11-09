import { z } from "zod";

const emptyToUndefined = (value: unknown) =>
  typeof value === "string" && value.trim() === "" ? undefined : value;

export const usernameSchema = z
  .string()
  .trim()
  .min(3, "Username must be at least 3 characters")
  .max(30, "Username must be at most 30 characters")
  .regex(
    /^[a-zA-Z0-9_]+$/,
    "Username may only contain letters, numbers, and underscores",
  );

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("Enter a valid email address")
  .max(254, "Email is too long");

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(72, "Password must be at most 72 characters");

const optionalNameSchema = z.preprocess(
  emptyToUndefined,
  z.string().trim().max(50, "Name must be at most 50 characters").optional(),
);

const optionalImageUrlSchema = z.preprocess(
  emptyToUndefined,
  z.string().trim().url("Enter a valid image URL").max(2048).optional(),
);

export const registerSchema = z.object({
  username: usernameSchema,
  email: emailSchema,
  password: passwordSchema,
  profileImgUrl: optionalImageUrlSchema,
  firstName: optionalNameSchema,
  lastName: optionalNameSchema,
});

export const credentialsSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required").max(72),
  username: z.string().optional(),
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z.object({
  token: z
    .string()
    .trim()
    .min(1, "Reset token is required")
    .max(256, "Reset token is invalid"),
  password: passwordSchema,
});

export const resetPasswordFormSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });
