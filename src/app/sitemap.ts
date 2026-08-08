import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/siteUrl";
import { modules } from "@/lib/curriculum";
import { managers } from "@/lib/managers";
import { positions } from "@/lib/positions";
import { quizzes } from "@/lib/quizzes";

/**
 * Every publicly indexable route, built from the same data that drives
 * generateStaticParams — so a new manager, lesson, or position appears in the
 * sitemap the moment it appears in the content, with no second list to keep
 * in sync.
 *
 * Deliberately excluded: /account, /admin, /join, /login and /auth/*. They are
 * either per-user or sign-in walls, so indexing them wastes crawl budget and
 * puts a login form in search results. robots.ts disallows the same set.
 *
 * Priority is relative within this one site, not an absolute quality claim.
 * The teaching content that answers a search query outranks the interactive
 * tools, which are worth more to someone already here than to someone
 * arriving cold from a results page.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  // Annotated before the map: spreading into an object literal widens
  // changeFrequency from its union member to plain `string` otherwise.
  const staticRoutes: MetadataRoute.Sitemap = (
    [
      { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
      { url: `${SITE_URL}/academy`, changeFrequency: "weekly", priority: 0.9 },
      { url: `${SITE_URL}/positions`, changeFrequency: "monthly", priority: 0.9 },
      { url: `${SITE_URL}/managers`, changeFrequency: "monthly", priority: 0.8 },
      { url: `${SITE_URL}/explore`, changeFrequency: "monthly", priority: 0.8 },
      { url: `${SITE_URL}/workouts`, changeFrequency: "monthly", priority: 0.7 },
      { url: `${SITE_URL}/quiz`, changeFrequency: "monthly", priority: 0.6 },
      { url: `${SITE_URL}/tactics-lab`, changeFrequency: "monthly", priority: 0.6 },
      { url: `${SITE_URL}/challenge`, changeFrequency: "monthly", priority: 0.5 },
      // Low priority but deliberately indexed, unlike /settings and /account:
      // an OAuth consent-screen review expects to reach these, and a policy
      // nobody can find is not much of a policy.
      { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.3 },
      { url: `${SITE_URL}/terms`, changeFrequency: "yearly", priority: 0.3 },
    ] satisfies MetadataRoute.Sitemap
  ).map((route) => ({ ...route, lastModified }));

  const positionRoutes: MetadataRoute.Sitemap = Object.keys(positions).map((code) => ({
    url: `${SITE_URL}/positions/${code.toLowerCase()}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const managerRoutes: MetadataRoute.Sitemap = managers.map((manager) => ({
    url: `${SITE_URL}/managers/${manager.slug}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // Mirrors generateStaticParams exactly: modules with no lessons have no
  // page, and modules with no quiz have no quiz page. Listing either would
  // put a 404 in the sitemap.
  const moduleRoutes: MetadataRoute.Sitemap = modules
    .filter((module) => module.lessons.length > 0)
    .map((module) => ({
      url: `${SITE_URL}/academy/${module.slug}`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    }));

  const lessonRoutes: MetadataRoute.Sitemap = modules.flatMap((module) =>
    module.lessons.map((lesson) => ({
      url: `${SITE_URL}/academy/${module.slug}/${lesson.slug}`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    })),
  );

  const moduleQuizRoutes: MetadataRoute.Sitemap = modules
    .filter((module) => module.quiz.length > 0)
    .map((module) => ({
      url: `${SITE_URL}/academy/${module.slug}/quiz`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.4,
    }));

  const quizRoutes: MetadataRoute.Sitemap = quizzes.map((quiz) => ({
    url: `${SITE_URL}/quiz/${quiz.slug}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [
    ...staticRoutes,
    ...positionRoutes,
    ...managerRoutes,
    ...moduleRoutes,
    ...lessonRoutes,
    ...moduleQuizRoutes,
    ...quizRoutes,
  ];
}
