"use client"

import { useState } from "react"
import { Card } from "../src/components/card"
import axios from "axios";
import { useRouter } from "next/navigation"
import Link from "next/link";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
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

export default function SignUp() {
  const router = useRouter();
  const { showToast } = useToast();
  const [user, setUser] = useState<UserForm>(initialUser);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { errorFor, onBlur, clearError, applyErrors, submit } =
    useZodForm(registerSchema);

  const updateField = (field: keyof UserForm, value: string) => {
    setUser((current) => ({ ...current, [field]: value }));
    clearError(field);
  };

  const inputClassName = (field: keyof UserForm, extra = "") =>
    `m-2 p-3 border-b-2 outline-none ${errorFor(field) ? "border-red-500" : ""} ${extra}`;

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
    <div className="">
      <Card title="SignUp">
        <form className="flex flex-col" onSubmit={handleSubmit} noValidate>
          {formError && (
            <div
              role="alert"
              className="m-2 rounded-lg border border-red-400/40 bg-red-500/10 p-3 text-sm text-red-300"
            >
              {formError}
            </div>
          )}

          <input
            className={inputClassName("username")}
            type="text"
            placeholder="username"
            autoComplete="username"
            value={user.username}
            aria-invalid={!!errorFor("username")}
            aria-describedby={errorFor("username") ? "signup-username-error" : undefined}
            onChange={(e) => updateField("username", e.target.value)}
            onBlur={() => onBlur("username", user)}
          />
          {errorFor("username") ? (
            <FieldError id="signup-username-error" message={errorFor("username")} />
          ) : (
            <p className="mx-2 -mt-1 text-xs text-slate-400">
              3–30 characters. Letters, numbers, and underscores only.
            </p>
          )}

          <input
            className={inputClassName("email")}
            type="email"
            placeholder="email"
            autoComplete="email"
            value={user.email}
            aria-invalid={!!errorFor("email")}
            aria-describedby={errorFor("email") ? "signup-email-error" : undefined}
            onChange={(e) => updateField("email", e.target.value)}
            onBlur={() => onBlur("email", user)}
          />
          <FieldError id="signup-email-error" message={errorFor("email")} />

          <input
            className={inputClassName("password")}
            type="password"
            placeholder="password"
            autoComplete="new-password"
            value={user.password}
            aria-invalid={!!errorFor("password")}
            aria-describedby={errorFor("password") ? "signup-password-error" : undefined}
            onChange={(e) => updateField("password", e.target.value)}
            onBlur={() => onBlur("password", user)}
          />
          {errorFor("password") ? (
            <FieldError id="signup-password-error" message={errorFor("password")} />
          ) : (
            <p className="mx-2 -mt-1 text-xs text-slate-400">
              8–72 characters.
            </p>
          )}

          <input
            className={inputClassName("firstName")}
            type="text"
            placeholder="firstName"
            autoComplete="given-name"
            value={user.firstName}
            aria-invalid={!!errorFor("firstName")}
            aria-describedby={errorFor("firstName") ? "signup-firstname-error" : undefined}
            onChange={(e) => updateField("firstName", e.target.value)}
            onBlur={() => onBlur("firstName", user)}
          />
          <FieldError id="signup-firstname-error" message={errorFor("firstName")} />

          <input
            className={inputClassName("lastName")}
            type="text"
            placeholder="lastName"
            autoComplete="family-name"
            value={user.lastName}
            aria-invalid={!!errorFor("lastName")}
            aria-describedby={errorFor("lastName") ? "signup-lastname-error" : undefined}
            onChange={(e) => updateField("lastName", e.target.value)}
            onBlur={() => onBlur("lastName", user)}
          />
          <FieldError id="signup-lastname-error" message={errorFor("lastName")} />

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
                  className="border border-gray-300 rounded-lg mb-4 p-2 m-3"
                >
                  Upload Profile Image
                </button>
              );
            }}
          </CldUploadWidget>

          {user.profileImgUrl && (
            <Image
              src={user.profileImgUrl}
              alt="Profile Preview"
              width={200}
              height={200}
              className="w-24 h-24 rounded-full object-cover mx-auto my-3"
            />
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="border border-gray-300 rounded-lg mb-4 p-2 m-3 disabled:opacity-50"
          >
            {isSubmitting ? "Creating account..." : "SignUp"}
          </button>

          <div>
            <p className="font-semibold">Already have an account ???</p>
            <p className="mt-3">
              Visit{" "}
              <Link className="mx-3 bg-blue-400 rounded-lg p-2" href="/api/auth/signin">
                SignIn Page
              </Link>
            </p>
          </div>
        </form>
      </Card>
    </div>
  );
}
