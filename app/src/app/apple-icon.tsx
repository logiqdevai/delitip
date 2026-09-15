import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const logoData = await readFile(join(process.cwd(), "public/delitip.png"), "base64");
const logoSrc = `data:image/png;base64,${logoData}`;

// iOS flattens transparency to black, and applies its own rounded-squircle
// mask — so this ships full-bleed on an opaque background, unrounded.
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#C8F169",
        }}
      >
        <img src={logoSrc} width="86%" height="86%" />
      </div>
    ),
    { ...size }
  );
}
