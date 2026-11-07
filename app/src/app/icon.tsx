import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Search engines (Google) only accept site icons that are at least 48x48 and a
// multiple of 48px, so favicon.ico (16/32px) alone never shows up in results.
export const size = { width: 192, height: 192 };
export const contentType = "image/png";

const logoData = await readFile(join(process.cwd(), "public/delitip.png"), "base64");
const logoSrc = `data:image/png;base64,${logoData}`;

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#181A1B",
          borderRadius: "22%",
        }}
      >
        <img src={logoSrc} width="78%" height="78%" />
      </div>
    ),
    { ...size }
  );
}
