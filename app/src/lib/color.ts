const INK_CHARCOAL = "#181A1B";
const PAPER_OFFWHITE = "#F7F7F2";

function hexToRgb(hex: string): [number, number, number] | null {
  const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
  if (!match) return null;
  return [
    parseInt(match[1], 16),
    parseInt(match[2], 16),
    parseInt(match[3], 16),
  ];
}

function relativeLuminance([r, g, b]: [number, number, number]): number {
  const channel = (value: number) => {
    const normalized = value / 255;
    return normalized <= 0.03928
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/** Returns ink-charcoal or paper-offwhite, whichever reads better on top of `hex`. */
export function getReadableTextColor(hex: string): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return INK_CHARCOAL;
  return relativeLuminance(rgb) > 0.5 ? INK_CHARCOAL : PAPER_OFFWHITE;
}
