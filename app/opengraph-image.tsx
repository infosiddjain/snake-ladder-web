import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { APP_NAME, APP_TAGLINE } from "@/lib/site";

export const alt = `${APP_NAME} — play ${APP_TAGLINE} online with friends`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const logo = await readFile(join(process.cwd(), "public/icons/icon-512.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: 64,
          padding: "0 96px",
          background: "radial-gradient(circle at 30% 40%, #23234a, #0a0a14 70%)",
          color: "#fbf5e6",
        }}
      >
        <img src={logoSrc} width={300} height={300} alt="" style={{ borderRadius: 64 }} />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 36, color: "#d4af37", letterSpacing: 4, textTransform: "uppercase" }}>
            {APP_TAGLINE}
          </div>
          <div style={{ fontSize: 120, fontWeight: 700, color: "#f3d98b", lineHeight: 1.1 }}>{APP_NAME}</div>
          <div style={{ fontSize: 40, marginTop: 16, maxWidth: 620 }}>
            Play live with friends — share a room code, roll the dice.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
