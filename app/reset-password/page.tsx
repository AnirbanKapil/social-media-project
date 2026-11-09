import Link from "next/link";
import { CircleAlert } from "lucide-react";
import { Card } from "@/app/src/components/card";
import { ResetPasswordForm } from "./ResetPasswordForm";

type ResetPasswordPageProps = {
  searchParams: Promise<{ token?: string | string[] }>;
};

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const params = await searchParams;
  const rawToken = params.token;
  const token = Array.isArray(rawToken) ? rawToken[0] : rawToken;

  if (!token) {
    return (
      <Card title="Reset link is invalid">
        <div
          role="alert"
          className="flex items-start gap-2 rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300"
        >
          <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
          <span>This password reset link is invalid or has expired.</span>
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

  return <ResetPasswordForm token={token} />;
}
