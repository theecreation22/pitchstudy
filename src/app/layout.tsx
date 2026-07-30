import type { Metadata } from "next";
import { Big_Shoulders, Public_Sans, IBM_Plex_Mono } from "next/font/google";
import { FloodlitAtmosphere } from "@/components/effects/FloodlitAtmosphere";
import { SiteNav } from "@/components/nav/SiteNav";
import "./globals.css";

const bigShoulders = Big_Shoulders({
  variable: "--font-big-shoulders",
  weight: ["500", "700", "900"],
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
      className={`${bigShoulders.variable} ${publicSans.variable} ${plexMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-pitch-slate text-pitch-line antialiased">
        <FloodlitAtmosphere />
        <SiteNav />
        {children}
      </body>
    </html>
  );
}
