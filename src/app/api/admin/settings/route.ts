import { jsonError, jsonOk } from "@/lib/api";
import { requireAdmin } from "@/lib/admin";
import { getSiteSettings, updateSiteSettings } from "@/lib/data";
import { siteSettingsSchema } from "@/lib/validators";

export async function GET() {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  try {
    const settings = await getSiteSettings();
    return jsonOk({ settings });
  } catch (err) {
    console.error("[admin:settings:get]", err);
    return jsonError("Failed to load settings.", 500);
  }
}

export async function PUT(request: Request) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  try {
    const body = await request.json().catch(() => null);
    const parsed = siteSettingsSchema.safeParse(body);
    if (!parsed.success) return jsonError("Invalid settings.", 422);

    const settings = await updateSiteSettings({
      siteName: parsed.data.siteName,
      tagline: parsed.data.tagline,
      logoUrl: parsed.data.logoUrl ?? "",
    });

    return jsonOk({ settings });
  } catch (err) {
    console.error("[admin:settings:put]", err);
    return jsonError("Failed to save settings.", 500);
  }
}
