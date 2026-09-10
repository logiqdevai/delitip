export const BRAND_MARK_INK = "#181A1B";
export const BRAND_MARK_LIME = "#C8F169";

interface BrandMarkGlyphProps {
  size?: number | string;
}

/**
 * The "Scan & Drop" glyph: a QR finder-pattern eyelet mid-drop into a tip cup.
 * Plain SVG shapes (no wrapper) so it renders identically inside a Tailwind
 * badge (BrandMark) and inside next/og ImageResponse (icon/apple-icon/opengraph-image),
 * which can't see the app's CSS.
 */
export function BrandMarkGlyph({ size = "62%" }: BrandMarkGlyphProps) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden="true">
      <path
        d="M17 30 L20 47 Q20.5 50.5 24 50.5 L30 50.5 Q33.5 50.5 34 47 L37 30 Z"
        fill={BRAND_MARK_INK}
      />
      <rect x="38" y="10" width="18" height="18" rx="5" fill={BRAND_MARK_INK} />
      <rect x="42" y="14" width="10" height="10" rx="3" fill={BRAND_MARK_LIME} />
      <rect x="45" y="17" width="4" height="4" rx="1.2" fill={BRAND_MARK_INK} />
    </svg>
  );
}
