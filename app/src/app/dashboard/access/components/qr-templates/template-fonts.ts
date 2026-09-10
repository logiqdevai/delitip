import { Playfair_Display } from "next/font/google";

// A display serif for the printable card templates only - the rest of the app
// stays on Plus Jakarta Sans (see app/layout.tsx). next/font self-hosts the
// font, so it rasterizes reliably via html-to-image with no runtime fetch.
export const templateSerif = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--qr-template-serif",
  display: "swap",
});
