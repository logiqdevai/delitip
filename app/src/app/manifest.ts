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
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
