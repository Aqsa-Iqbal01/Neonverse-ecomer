import type { NextResponse } from "next/server";
import { getSession } from "./auth";
import { jsonError } from "./api";

export type AdminGuardResult =
  | { ok: true }
  | { ok: false; response: NextResponse };

/** Ensure the current request comes from a signed-in admin. */
export async function requireAdmin(): Promise<AdminGuardResult> {
  const session = await getSession();
  if (!session) return { ok: false, response: jsonError("Please sign in.", 401) };
  if (session.role !== "admin") {
    return { ok: false, response: jsonError("You need admin access for this.", 403) };
  }
  return { ok: true };
}
