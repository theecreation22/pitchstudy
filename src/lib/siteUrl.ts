/**
 * The canonical origin, used by the sitemap, robots.txt, and every absolute
 * URL in social metadata.
 *
 * apex pitchstudy.com 301s to the www host, so www is the canonical form —
 * pointing crawlers or an Open Graph scraper at the apex would make every
 * URL a redirect. Override with NEXT_PUBLIC_SITE_URL when running against a
 * preview deploy, otherwise previews would advertise production URLs.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.pitchstudy.com").replace(/\/$/, "");

/** Absolute URL for a repo-root-relative path. Social scrapers reject relative URLs, so metadata can never use bare paths. */
export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
