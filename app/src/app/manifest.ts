import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "delitip - Digital Tipping & Employee Feedback",
    short_name: "delitip",
    description:
      "delitip is the modern digital tipping and employee feedback platform for restaurants, cafes, bars, hotels, and salons.",
    start_url: "/",
    display: "standalone",
    background_color: "#181A1B",
    theme_color: "#C8F169",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "48x48 32x32 16x16",
        type: "image/x-icon",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
