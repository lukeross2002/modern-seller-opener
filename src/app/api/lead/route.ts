export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, firstName, source } = body || {};
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return Response.json({ error: "Valid email required." }, { status: 400 });
    }

    const webhookUrl = process.env.LEAD_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            first_name: firstName || "",
            source: source || "opener-generator",
            captured_at: new Date().toISOString(),
            tag: "modern-seller-opener-tool",
          }),
        });
      } catch (e) {
        console.error("Lead webhook failed:", e);
      }
    } else {
      console.log("[lead]", { email, firstName, source });
    }

    return Response.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: msg }, { status: 500 });
  }
}
