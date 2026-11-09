import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  forgotPasswordSchema,
  formatValidationErrors,
} from "@/lib/validation";
import { isRateLimited, storeResetToken } from "@/lib/passwordReset";
import { sendPasswordResetEmail } from "@/lib/email";

const GENERIC_MESSAGE =
  "If an account with that email exists, a password reset link has been sent.";

function getClientIp(req: NextRequest): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }
  return req.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(req: NextRequest) {
  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { message: "Invalid request body" },
      { status: 400 },
    );
  }

  const parsed = forgotPasswordSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "Invalid input",
        errors: formatValidationErrors(parsed.error),
      },
      { status: 400 },
    );
  }

  const { email } = parsed.data;
  const ip = getClientIp(req);

  try {
    const [ipLimited, emailLimited] = await Promise.all([
      isRateLimited(`ip:${ip}`),
      isRateLimited(`email:${email}`),
    ]);

    if (ipLimited || emailLimited) {
      return NextResponse.json(
        { message: "Too many reset requests. Please try again later." },
        { status: 429 },
      );
    }

    const user = await prisma.user.findFirst({
      where: { email: { equals: email, mode: "insensitive" } },
    });

    if (user?.password) {
      const token = await storeResetToken(user.id);
      const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
      const resetUrl = `${baseUrl}/reset-password?token=${token}`;

      try {
        await sendPasswordResetEmail(user.email, resetUrl);
      } catch (error) {
        console.error("Failed to send password reset email:", error);
      }
    }

    return NextResponse.json({ message: GENERIC_MESSAGE }, { status: 200 });
  } catch (error) {
    console.error("Failed to process forgot password request:", error);
    return NextResponse.json(
      { message: "Something went wrong. Please try again later." },
      { status: 500 },
    );
  }
}
