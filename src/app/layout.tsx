import type { Metadata } from "next";
import { Barlow_Condensed, Public_Sans, IBM_Plex_Mono } from "next/font/google";
import { FloodlitAtmosphere } from "@/components/effects/FloodlitAtmosphere";
import { SiteNav } from "@/components/nav/SiteNav";
import { SyncProvider } from "@/lib/sync/SyncProvider";
import { SyncInvitation } from "@/components/auth/SyncInvitation";
import { MotionPreferenceProvider } from "@/components/motion/MotionPreferenceProvider";
import { SITE_URL } from "@/lib/siteUrl";
import "./globals.css";

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  weight: ["500", "600", "700", "900"],
  subsets: ["latin"],
});

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});

const SITE_NAME = "PitchStudy";
const TITLE = "PitchStudy: Learn football tactics, interactively";
const DESCRIPTION =
  "Explore formations on an interactive pitch, learn what every position does, and train for the role you want to play.";

export const metadata: Metadata = {
  // Required for social metadata: Open Graph and Twitter reject relative
  // URLs, so without a metadataBase every card resolves to nothing and the
  // link renders as a bare URL. This is also what makes per-route
  // opengraph-image.tsx files resolve to absolute URLs automatically.
  metadataBase: new URL(SITE_URL),
  // Deliberately no `template`. All 18 pages already write their own suffix,
  // and the Academy ones use "· PitchStudy Academy" rather than the plain
  // brand, which one template cannot express. Adding one produced
  // "Defensive Midfielder (CDM) · PitchStudy · PitchStudy".
  title: TITLE,
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${barlowCondensed.variable} ${publicSans.variable} ${plexMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-pitch-slate text-pitch-line antialiased lg:pl-60">
        <MotionPreferenceProvider>
          <SyncProvider>
            <FloodlitAtmosphere />
            <SiteNav />
            {children}
            <SyncInvitation />
          </SyncProvider>
        </MotionPreferenceProvider>
      </body>
    </html>
  );
}
