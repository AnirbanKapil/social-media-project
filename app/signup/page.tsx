"use client"

import { useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { Card } from "../src/components/card"
import axios from "axios";
import { useRouter } from "next/navigation"
import Link from "next/link";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import {
  AtSign,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Camera,
  ArrowRight,
  LoaderCircle,
  CircleAlert,
} from "lucide-react";
import { FieldError } from "@/app/src/components/form/FieldError";
import { useToast } from "@/app/context/toast-provider";
import {
  registerSchema,
  serverFieldErrors,
} from "@/lib/validation";
import { useZodForm } from "@/lib/validation/useZodForm";

const initialUser = {
  username: "",
  password: "",
  email: "",
  profileImgUrl: "",
  firstName: "",
  lastName: "",
};

type UserForm = typeof initialUser;

const labelClassName = "mb-1.5 block text-sm font-medium text-[#b0b0c0]";
const hintClassName = "mt-1 text-xs text-[#666680]";
const fieldIconClassName =
  "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#666680]";

export default function SignUp() {
  const router = useRouter();
  const { showToast } = useToast();
  const reducedMotion = useReducedMotion();
  const [user, setUser] = useState<UserForm>(initialUser);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { errorFor, onBlur, clearError, applyErrors, submit } =
    useZodForm(registerSchema);

  const updateField = (field: keyof UserForm, value: string) => {
    setUser((current) => ({ ...current, [field]: value }));
    clearError(field);
  };

  const inputClassName = (field: keyof UserForm, extra = "") =>
    `w-full rounded-lg border bg-white/5 px-4 py-3 pl-11 text-sm text-[#f0f0f5] placeholder:text-[#666680] outline-none transition focus:ring-2 ${extra} ${
      errorFor(field)
        ? "border-red-500 focus:border-red-500 focus:ring-red-500/30"
        : "border-white/10 focus:border-indigo-500 focus:ring-indigo-500/30"
    }`;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null);

    const data = submit(user);

    if (!data) {
      setFormError("Please fix the highlighted fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      await axios.post("/api/auth/register", data);
      showToast({
        title: "Account created",
        description: "Redirecting you to the sign in page...",
      });
      setTimeout(() => {
        router.push("/api/auth/signin");
      }, 1500);
    } catch (error) {
      const payload = axios.isAxiosError(error) ? error.response?.data : null;
      const serverErrors = serverFieldErrors(payload);

      if (Object.keys(serverErrors).length > 0) {
        applyErrors(serverErrors);
      }

      const message =
        payload && typeof payload.message === "string"
          ? payload.message
          : "Unable to create your account. Please try again.";

      setFormError(message);
      showToast({ title: "Sign up failed", description: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card title="Create your account">
      <motion.form
        className="flex flex-col gap-4"
        onSubmit={handleSubmit}
        noValidate
        initial={reducedMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {formError && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300"
          >
            <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <div>
          <label htmlFor="signup-username" className={labelClassName}>
            Username
          </label>
          <div className="relative">
            <AtSign className={fieldIconClassName} />
            <input
              id="signup-username"
              className={inputClassName("username")}
              type="text"
              placeholder="yourname"
              autoComplete="username"
              value={user.username}
              aria-invalid={!!errorFor("username")}
              aria-describedby={errorFor("username") ? "signup-username-error" : undefined}
              onChange={(e) => updateField("username", e.target.value)}
              onBlur={() => onBlur("username", user)}
            />
          </div>
          {errorFor("username") ? (
            <FieldError
              id="signup-username-error"
              message={errorFor("username")}
              className="mt-1 text-sm text-red-400"
            />
          ) : (
            <p className={hintClassName}>
              3–30 characters. Letters, numbers, and underscores only.
            </p>
          )}
        </div>

        <div>
          <label htmlFor="signup-email" className={labelClassName}>
            Email
          </label>
          <div className="relative">
            <Mail className={fieldIconClassName} />
            <input
              id="signup-email"
              className={inputClassName("email")}
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={user.email}
              aria-invalid={!!errorFor("email")}
              aria-describedby={errorFor("email") ? "signup-email-error" : undefined}
              onChange={(e) => updateField("email", e.target.value)}
              onBlur={() => onBlur("email", user)}
            />
          </div>
          <FieldError
            id="signup-email-error"
            message={errorFor("email")}
            className="mt-1 text-sm text-red-400"
          />
        </div>

        <div>
          <label htmlFor="signup-password" className={labelClassName}>
            Password
          </label>
          <div className="relative">
            <Lock className={fieldIconClassName} />
            <input
              id="signup-password"
              className={inputClassName("password", "pr-11")}
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="new-password"
              value={user.password}
              aria-invalid={!!errorFor("password")}
              aria-describedby={errorFor("password") ? "signup-password-error" : undefined}
              onChange={(e) => updateField("password", e.target.value)}
              onBlur={() => onBlur("password", user)}
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666680] transition hover:text-[#b0b0c0]"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errorFor("password") ? (
            <FieldError
              id="signup-password-error"
              message={errorFor("password")}
              className="mt-1 text-sm text-red-400"
            />
          ) : (
            <p className={hintClassName}>8–72 characters.</p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="signup-firstname" className={labelClassName}>
              First name
            </label>
            <div className="relative">
              <User className={fieldIconClassName} />
              <input
                id="signup-firstname"
                className={inputClassName("firstName")}
                type="text"
                placeholder="Ada"
                autoComplete="given-name"
                value={user.firstName}
                aria-invalid={!!errorFor("firstName")}
                aria-describedby={errorFor("firstName") ? "signup-firstname-error" : undefined}
                onChange={(e) => updateField("firstName", e.target.value)}
                onBlur={() => onBlur("firstName", user)}
              />
            </div>
            <FieldError
              id="signup-firstname-error"
              message={errorFor("firstName")}
              className="mt-1 text-sm text-red-400"
            />
          </div>

          <div>
            <label htmlFor="signup-lastname" className={labelClassName}>
              Last name
            </label>
            <div className="relative">
              <User className={fieldIconClassName} />
              <input
                id="signup-lastname"
                className={inputClassName("lastName")}
                type="text"
                placeholder="Lovelace"
                autoComplete="family-name"
                value={user.lastName}
                aria-invalid={!!errorFor("lastName")}
                aria-describedby={errorFor("lastName") ? "signup-lastname-error" : undefined}
                onChange={(e) => updateField("lastName", e.target.value)}
                onBlur={() => onBlur("lastName", user)}
              />
            </div>
            <FieldError
              id="signup-lastname-error"
              message={errorFor("lastName")}
              className="mt-1 text-sm text-red-400"
            />
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 pt-1">
          <CldUploadWidget
            uploadPreset="profile-images"
            options={{
              cropping: true,
              croppingAspectRatio: 1,
              sources: ["local"],
            }}
            onSuccess={(result: unknown) => {
              const imageUrl = (
                result as { info?: { secure_url?: string } } | null
              )?.info?.secure_url;
              if (!imageUrl) return;
              setUser((prev) => ({
                ...prev,
                profileImgUrl: imageUrl,
              }));
            }}
          >
            {({ open }) => {
              return (
                <button
                  type="button"
                  onClick={() => open()}
                  aria-label={user.profileImgUrl ? "Change profile image" : "Upload profile image"}
                  className={`group relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 bg-white/5 text-[#888899] transition hover:border-indigo-500 hover:text-indigo-400 ${
                    user.profileImgUrl
                      ? "border-solid border-indigo-500/50 ring-2 ring-indigo-500/20"
                      : "border-dashed border-white/20"
                  }`}
                >
                  {user.profileImgUrl ? (
                    <>
                      <Image
                        src={user.profileImgUrl}
                        alt="Profile preview"
                        width={96}
                        height={96}
                        className="h-full w-full object-cover"
                      />
                      <span className="absolute inset-0 flex items-center justify-center bg-black/60 text-xs font-medium text-white opacity-0 transition group-hover:opacity-100">
                        Change
                      </span>
                    </>
                  ) : (
                    <span className="flex flex-col items-center gap-1">
                      <Camera className="h-5 w-5" />
                      <span className="text-[10px]">Add photo</span>
                    </span>
                  )}
                </button>
              );
            }}
          </CldUploadWidget>
          <span className="text-xs text-[#666680]">
            {user.profileImgUrl ? "Looking good!" : "Add a profile photo (optional)"}
          </span>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="group mt-1 flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:from-indigo-400 hover:to-purple-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            <>
              Create account
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>

        <div className="mt-1 flex flex-col items-center gap-1.5 border-t border-white/10 pt-5 text-sm text-[#888899]">
          <p>Already have an account?</p>
          <Link
            href="/api/auth/signin"
            className="font-medium text-indigo-400 transition hover:text-indigo-300"
          >
            Sign in
          </Link>
        </div>
      </motion.form>
    </Card>
  );
}
