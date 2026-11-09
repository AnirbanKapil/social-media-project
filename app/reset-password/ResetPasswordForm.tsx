"use client";

import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CircleAlert,
  Eye,
  EyeOff,
  LoaderCircle,
  Lock,
} from "lucide-react";
import { Card } from "@/app/src/components/card";
import { FieldError } from "@/app/src/components/form/FieldError";
import { useToast } from "@/app/context/toast-provider";
import { resetPasswordFormSchema } from "@/lib/validation";
import { useZodForm } from "@/lib/validation/useZodForm";

const labelClassName = "mb-1.5 block text-sm font-medium text-[#b0b0c0]";
const fieldIconClassName =
  "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#666680]";
const eyeButtonClassName =
  "absolute right-3 top-1/2 -translate-y-1/2 text-[#666680] transition hover:text-[#b0b0c0]";

export function ResetPasswordForm({ token }: { token: string }) {
  const { showToast } = useToast();
  const reducedMotion = useReducedMotion();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [invalidToken, setInvalidToken] = useState(false);

  const { errorFor, onBlur, clearError, submit } =
    useZodForm(resetPasswordFormSchema);

  const values = { password, confirmPassword };

  const inputClassName = (field: "password" | "confirmPassword") =>
    `w-full rounded-lg border bg-white/5 px-4 py-3 pl-11 text-sm text-[#f0f0f5] placeholder:text-[#666680] outline-none transition focus:ring-2 ${
      errorFor(field)
        ? "border-red-500 focus:border-red-500 focus:ring-red-500/30"
        : "border-white/10 focus:border-indigo-500 focus:ring-indigo-500/30"
    }`;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null);

    const data = submit(values);
    if (!data) return;

    setIsSubmitting(true);

    try {
      await axios.post("/api/auth/reset-password", {
        token,
        password: data.password,
      });
      setSubmitted(true);
    } catch (error) {
      const payload = axios.isAxiosError(error) ? error.response?.data : null;
      const status = axios.isAxiosError(error)
        ? error.response?.status
        : undefined;
      const message =
        payload && typeof payload.message === "string"
          ? payload.message
          : "Unable to reset your password. Please try again.";

      if (status === 400) {
        setInvalidToken(true);
      }

      setFormError(message);
      showToast({ title: "Reset failed", description: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Card title="Password updated">
        <motion.div
          role="status"
          className="flex flex-col items-center gap-4 text-center"
          initial={reducedMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
            <CheckCircle2 className="h-6 w-6" />
          </span>
          <p className="text-sm leading-6 text-[#b0b0c0]">
            Your password has been updated. You can now sign in with your new
            password.
          </p>
          <Link
            href="/api/auth/signin"
            className="mt-2 flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:from-indigo-400 hover:to-purple-400"
          >
            Go to sign in
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </Card>
    );
  }

  if (invalidToken) {
    return (
      <Card title="Reset link is invalid">
        <div
          role="alert"
          className="flex items-start gap-2 rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300"
        >
          <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            {formError ??
              "This password reset link is invalid or has expired."}
          </span>
        </div>
        <div className="mt-5 flex flex-col items-center gap-2 border-t border-white/10 pt-5 text-sm text-[#888899]">
          <Link
            href="/forgot-password"
            className="font-medium text-indigo-400 transition hover:text-indigo-300"
          >
            Request a new link
          </Link>
          <Link
            href="/api/auth/signin"
            className="text-[#888899] transition hover:text-[#b0b0c0]"
          >
            Back to sign in
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <Card title="Set a new password">
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

        <p className="text-sm leading-6 text-[#888899]">
          Choose a new password for your account. Use at least 8 characters.
        </p>

        <div>
          <label htmlFor="reset-password" className={labelClassName}>
            New password
          </label>
          <div className="relative">
            <Lock className={fieldIconClassName} />
            <input
              id="reset-password"
              className={`${inputClassName("password")} pr-11`}
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="new-password"
              value={password}
              aria-invalid={!!errorFor("password")}
              aria-describedby={
                errorFor("password") ? "reset-password-error" : undefined
              }
              onChange={(event) => {
                setPassword(event.target.value);
                clearError("password");
              }}
              onBlur={() => onBlur("password", values)}
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className={eyeButtonClassName}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          <FieldError
            id="reset-password-error"
            message={errorFor("password")}
            className="mt-1 text-sm text-red-400"
          />
        </div>

        <div>
          <label htmlFor="reset-confirm-password" className={labelClassName}>
            Confirm new password
          </label>
          <div className="relative">
            <Lock className={fieldIconClassName} />
            <input
              id="reset-confirm-password"
              className={`${inputClassName("confirmPassword")} pr-11`}
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="new-password"
              value={confirmPassword}
              aria-invalid={!!errorFor("confirmPassword")}
              aria-describedby={
                errorFor("confirmPassword")
                  ? "reset-confirm-password-error"
                  : undefined
              }
              onChange={(event) => {
                setConfirmPassword(event.target.value);
                clearError("confirmPassword");
              }}
              onBlur={() => onBlur("confirmPassword", values)}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((current) => !current)}
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }
              className={eyeButtonClassName}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          <FieldError
            id="reset-confirm-password-error"
            message={errorFor("confirmPassword")}
            className="mt-1 text-sm text-red-400"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="group mt-1 flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:from-indigo-400 hover:to-purple-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin" />
              Updating password...
            </>
          ) : (
            <>
              Update password
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>

        <div className="mt-1 flex justify-center border-t border-white/10 pt-5">
          <Link
            href="/api/auth/signin"
            className="flex items-center gap-2 text-sm font-medium text-indigo-400 transition hover:text-indigo-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to sign in
          </Link>
        </div>
      </motion.form>
    </Card>
  );
}
