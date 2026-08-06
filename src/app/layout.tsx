import type { Metadata } from "next";
import { Barlow_Condensed, Public_Sans, IBM_Plex_Mono } from "next/font/google";
import { FloodlitAtmosphere } from "@/components/effects/FloodlitAtmosphere";
import { SiteNav } from "@/components/nav/SiteNav";
import { SyncProvider } from "@/lib/sync/SyncProvider";
import { SyncInvitation } from "@/components/auth/SyncInvitation";
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

export const metadata: Metadata = {
  title: "PitchStudy: Learn football tactics, interactively",
  description:
    "Explore formations on an interactive pitch, learn what every position does, and train for the role you want to play.",
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
      <body className="min-h-full flex flex-col bg-pitch-slate text-pitch-line antialiased">
        <SyncProvider>
          <FloodlitAtmosphere />
          <SiteNav />
          {children}
          <SyncInvitation />
        </SyncProvider>
      </body>
    </html>
  );
}
