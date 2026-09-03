import { cookies } from "next/headers";
import { jsonOk } from "@/lib/api";
import { sessionCookie } from "@/lib/auth";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete(sessionCookie.name);
  return jsonOk({ ok: true });
}
