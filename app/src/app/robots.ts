import type { MetadataRoute } from "next";
import { environments } from "@/config/environments";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${environments.siteUrl}/sitemap.xml`,
  };
}
