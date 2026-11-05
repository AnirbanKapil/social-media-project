import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { formatValidationErrors, registerSchema } from "@/lib/validation";

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

  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "Invalid input",
        errors: formatValidationErrors(parsed.error),
      },
      { status: 400 },
    );
  }

  const { username, email, password, profileImgUrl, firstName, lastName } =
    parsed.data;

  try {
    const existingUser = await prisma.user.findFirst({
      where: { email: { equals: email, mode: "insensitive" } },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          message: "Email already exists",
          errors: { email: ["An account with this email already exists"] },
        },
        { status: 409 },
      );
    }

    const existingUsername = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUsername) {
      return NextResponse.json(
        {
          message: "Username is already taken",
          errors: { username: ["This username is already taken"] },
        },
        { status: 409 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        email,
        profileImgUrl,
        firstName,
        lastName,
      },
    });

    return NextResponse.json(
      { message: "User created successfully!!" },
      { status: 201 },
    );
  } catch (error) {
    console.error("Failed to register user:", error);
    return NextResponse.json(
      { message: "Error in registering" },
      { status: 500 },
    );
  }
}
