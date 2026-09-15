import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt =
  "delitip - Reward great service. Digital Tipping & Employee Feedback";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const logoData = await readFile(join(process.cwd(), "public/delitip.png"), "base64");
const logoSrc = `data:image/png;base64,${logoData}`;

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 96px",
          background: "#181A1B",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
          <img
            src={logoSrc}
            width={176}
            height={176}
            style={{ flexShrink: 0 }}
          />
          <div
            style={{
              display: "flex",
              fontSize: 100,
              fontWeight: 800,
              color: "#F7F7F2",
            }}
          >
            deli
            <span style={{ color: "#C8F169" }}>tip</span>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 48,
            maxWidth: 880,
            fontSize: 34,
            lineHeight: 1.4,
            color: "#A1A1AA",
          }}
        >
          Reward great service - digital tipping and employee feedback for
          restaurants, cafes, bars, hotels, and salons.
        </div>
      </div>
    ),
    { ...size }
  );
}
