import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function getAuthSession() {
  return getServerSession(authOptions);
}