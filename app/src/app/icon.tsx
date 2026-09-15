import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const size = { width: 32, height: 32 };
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
        }}
      >
        <img src={logoSrc} width="100%" height="100%" />
      </div>
    ),
    { ...size }
  );
}
