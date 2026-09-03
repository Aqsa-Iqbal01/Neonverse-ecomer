import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { loginSchema } from "@/lib/validators";
import { fromZodError, jsonError, jsonOk } from "@/lib/api";
import { requireDb } from "@/lib/data";
import { createSessionToken, sessionCookie } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) return fromZodError(parsed.error);

    const { email, password } = parsed.data;
    const db = requireDb();

    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
      return jsonError("Invalid email or password.", 401);
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return jsonError("Invalid email or password.", 401);
    }

    const token = await createSessionToken({
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    const cookieStore = await cookies();
    cookieStore.set(sessionCookie.name, token, sessionCookie.options);

    return jsonOk({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("[login]", err);
    return jsonError("Something went wrong. Please try again.", 500);
  }
}
