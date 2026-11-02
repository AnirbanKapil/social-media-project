import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { createRealtimeToken } from "@/server/realtime-token";

export const runtime = "nodejs";

export async function POST() {
  const session = await getAuthSession();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 },
    );
  }

  if (!process.env.REALTIME_AUTH_SECRET) {
    console.error("Realtime authentication is not configured");
    return NextResponse.json(
      { error: "Realtime service unavailable" },
      { status: 503 },
    );
  }

  const token = createRealtimeToken(userId);

  return NextResponse.json(
    {
      token,
      expiresIn: 300,
    },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, private",
        Pragma: "no-cache",
      },
    },
  );
}
