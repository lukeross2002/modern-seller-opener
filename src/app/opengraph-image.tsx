import { ImageResponse } from "next/og";

export const alt = "Modern Seller — cold-call openers that actually book";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background:
            "radial-gradient(ellipse at top right, rgba(141,123,255,0.32), transparent 55%), radial-gradient(ellipse at bottom left, rgba(90,161,255,0.18), transparent 60%), #07070d",
          fontFamily: "sans-serif",
          color: "#f4f4f8",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            fontSize: "22px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#9ca0b0",
          }}
        >
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "9999px",
              background: "linear-gradient(135deg, #8D7BFF, #C68FFF)",
              boxShadow: "0 0 12px rgba(141,123,255,0.7)",
            }}
          />
          Free tool · Built by Luke Ross
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div
            style={{
              fontSize: "108px",
              lineHeight: 0.98,
              letterSpacing: "-0.04em",
              fontWeight: 700,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>Cold-call openers</span>
            <span
              style={{
                background: "linear-gradient(120deg, #5AA1FF 0%, #8D7BFF 50%, #C68FFF 100%)",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              that actually book.
            </span>
          </div>
          <div
            style={{
              fontSize: "32px",
              color: "#cfd2dd",
              maxWidth: "920px",
              lineHeight: 1.35,
            }}
          >
            Drop in your prospect&apos;s name + company. Get 3 tailored openers anchored in live web research — free.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "26px",
            color: "#9ca0b0",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            paddingTop: "32px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ color: "#f4f4f8", fontWeight: 600 }}>opener.modernseller.ai</span>
          </div>
          <div style={{ display: "flex", gap: "32px" }}>
            <span>Trigger-led</span>
            <span>Peer-led</span>
            <span>Problem-led</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
