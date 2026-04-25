export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, firstName, source } = body || {};

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return Response.json({ error: "Valid email required." }, { status: 400 });
    }
    if (!firstName || typeof firstName !== "string" || !firstName.trim()) {
      return Response.json({ error: "First name required." }, { status: 400 });
    }

    const kitKey = process.env.KIT_API_KEY;
    const kitFormId = process.env.KIT_FORM_ID;

    let kitOk = false;
    let kitError: string | null = null;

    if (kitKey && kitFormId) {
      try {
        const res = await fetch(`https://api.convertkit.com/v3/forms/${kitFormId}/subscribe`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            api_key: kitKey,
            email: email.trim(),
            first_name: firstName.trim(),
          }),
        });
        if (res.ok) {
          kitOk = true;
        } else {
          const text = await res.text().catch(() => "");
          kitError = `Kit ${res.status}: ${text.slice(0, 200)}`;
          console.error("[lead] Kit subscribe failed:", kitError);
        }
      } catch (e) {
        kitError = e instanceof Error ? e.message : String(e);
        console.error("[lead] Kit subscribe threw:", kitError);
      }
    } else {
      console.warn("[lead] KIT_API_KEY or KIT_FORM_ID not set; lead not sent to Kit:", { email, firstName, source });
    }

    // Fallback webhook for redundancy / testing — only fires if env var is set.
    const webhookUrl = process.env.LEAD_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            first_name: firstName,
            source: source || "opener-generator",
            captured_at: new Date().toISOString(),
            tag: "modern-seller-opener-tool",
          }),
        });
      } catch (e) {
        console.error("[lead] Backup webhook failed:", e);
      }
    }

    // Always return ok to the client — we don't want a Kit hiccup to block the
    // user from using the tool they came here for. Errors are logged server-side.
    return Response.json({ ok: true, kit: kitOk, kitError });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: msg }, { status: 500 });
  }
}
