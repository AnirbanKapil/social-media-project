import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { finalizeAccountDeletion } from "@/lib/accountDeletion";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    console.error("CRON_SECRET is not configured");
    return NextResponse.json({ error: "Cron authentication is not configured" }, { status: 500 });
  }

  if (request.headers.get("authorization") !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dueAccounts = await prisma.user.findMany({
    where: {
      OR: [
        {
          accountStatus: "PENDING_DELETION",
          deletionScheduledAt: { lte: new Date() },
        },
        { accountStatus: "DELETING" },
      ],
    },
    select: { id: true },
    take: 50,
    orderBy: [{ deletionScheduledAt: "asc" }, { id: "asc" }],
  });

  const failures: string[] = [];
  let finalized = 0;
  for (const account of dueAccounts) {
    try {
      if (await finalizeAccountDeletion(account.id)) {
        finalized += 1;
      }
    } catch (error) {
      console.error(`Failed to finalize account deletion for ${account.id}:`, error);
      failures.push(account.id);
    }
  }

  return NextResponse.json(
    { finalized, attempted: dueAccounts.length, failed: failures },
    { status: failures.length ? 500 : 200 },
  );
}
