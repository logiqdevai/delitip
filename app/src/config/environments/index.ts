export const environments = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001",
} as const;
