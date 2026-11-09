import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import {
  formatValidationErrors,
  resetPasswordSchema,
} from "@/lib/validation";
import { consumeResetToken } from "@/lib/passwordReset";

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

  const parsed = resetPasswordSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "Invalid input",
        errors: formatValidationErrors(parsed.error),
      },
      { status: 400 },
    );
  }

  const { token, password } = parsed.data;

  try {
    const userId = await consumeResetToken(token);

    if (!userId) {
      return NextResponse.json(
        { message: "This reset link is invalid or has expired." },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return NextResponse.json(
      { message: "Password updated successfully. Please sign in." },
      { status: 200 },
    );
  } catch (error) {
    console.error("Failed to reset password:", error);
    return NextResponse.json(
      { message: "Something went wrong. Please try again later." },
      { status: 500 },
    );
  }
}
