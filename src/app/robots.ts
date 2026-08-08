import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/siteUrl";

/**
 * Disallows exactly what sitemap.ts omits: per-user pages, the admin view,
 * the sign-in wall, and the API. Everything else is teaching content that
 * should be indexed.
 *
 * Note this is a crawl instruction, not an access control — /admin is
 * protected by its own auth.email() check, not by this file.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/account", "/admin", "/settings", "/join", "/login", "/api/", "/auth/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
