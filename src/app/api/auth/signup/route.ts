import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { signupSchema } from "@/lib/validators";
import { fromZodError, jsonError, jsonOk } from "@/lib/api";
import { requireDb } from "@/lib/data";
import { createSessionToken, sessionCookie } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const parsed = signupSchema.safeParse(body);
    if (!parsed.success) return fromZodError(parsed.error);

    const { name, email, password } = parsed.data;
    const db = requireDb();

    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return jsonError("An account with this email already exists.", 409);
    }

    // First registered user becomes admin (so the site owner can open /admin).
    // Alternatively, set ADMIN_EMAIL in .env to promote a specific address.
    const totalUsers = await db.user.count();
    const isAdminEmail =
      process.env.ADMIN_EMAIL?.toLowerCase() === email.toLowerCase();
    const role = totalUsers === 0 || isAdminEmail ? "admin" : "user";

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await db.user.create({
      data: { name, email, passwordHash, role },
    });

    const token = await createSessionToken({
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    const cookieStore = await cookies();
    cookieStore.set(sessionCookie.name, token, sessionCookie.options);

    return jsonOk(
      { user: { id: user.id, name: user.name, email: user.email, role: user.role } },
      201
    );
  } catch (err) {
    console.error("[signup]", err);
    if (err instanceof Error && err.message.includes("database is not configured")) {
      return jsonError("Server is not configured. Add DATABASE_URL to .env.", 503);
    }
    return jsonError("Something went wrong. Please try again.", 500);
  }
}
