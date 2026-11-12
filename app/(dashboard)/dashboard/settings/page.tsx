"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useRequestAccountDeletionMutation } from "@/lib/generated";
import { useToast } from "@/app/context/toast-provider";

export default function AccountSettingsPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const deletionMutation = useRequestAccountDeletionMutation();

  const requestDeletion = async () => {
    const confirmed = window.confirm(
      "Hide your posts and schedule account deletion? You can cancel by signing in again within 7 days.",
    );
    if (!confirmed) {
      return;
    }

    setIsSubmitting(true);
    try {
      await deletionMutation.mutateAsync({});
      await signOut({ redirect: false });
      router.replace("/loggedoutuser");
    } catch (error) {
      showToast({
        title: "Could not request account deletion",
        description: error instanceof Error ? error.message : undefined,
      });
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto max-w-2xl space-y-6 p-6 text-white">
      <h1 className="text-2xl font-bold">Account settings</h1>
      <section className="space-y-3 rounded-xl border border-red-900/70 bg-slate-950 p-5">
        <h2 className="text-lg font-semibold text-red-300">Delete account</h2>
        <p className="text-sm text-slate-300">
          Your posts will be hidden immediately. Your account is scheduled for
          deletion after 7 days. Sign in again before then to cancel deletion
          and restore your account and posts.
        </p>
        <button
          type="button"
          onClick={() => void requestDeletion()}
          disabled={isSubmitting || deletionMutation.isPending}
          className="rounded-lg bg-red-700 px-4 py-2 font-semibold text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting || deletionMutation.isPending
            ? "Requesting deletion..."
            : "Request account deletion"}
        </button>
      </section>
    </main>
  );
}
