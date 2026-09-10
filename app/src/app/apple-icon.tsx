import { ImageResponse } from "next/og";
import { BrandMarkGlyph } from "@/components/brand/brand-mark-glyph";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// iOS applies its own rounded-squircle mask, so this ships full-bleed and
// unrounded — baking in our own corner radius would show through as a ring.
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
        <BrandMarkGlyph size={112} />
      </div>
    ),
    { ...size }
  );
}
