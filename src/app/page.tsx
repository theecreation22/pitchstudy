import { HeroPitch } from "@/components/home/HeroPitch";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { TiltCard } from "@/components/motion/TiltCard";
import { ChalkDivider } from "@/components/effects/ChalkDivider";
import { ExploreMiniPitch } from "@/components/home/cards/ExploreMiniPitch";
import { TacticsLabMiniCard } from "@/components/home/cards/TacticsLabMiniCard";
import { ManagersMiniCard } from "@/components/home/cards/ManagersMiniCard";
import { AcademyMiniCard } from "@/components/home/cards/AcademyMiniCard";
import { ChallengeMiniCard } from "@/components/home/cards/ChallengeMiniCard";
import { TrainingMiniCard } from "@/components/home/cards/TrainingMiniCard";

type CardMeta = {
  href: string;
  eyebrow: string;
  title: string;
  copy: string;
  Demo: () => React.ReactElement;
};

// Shared by all three bento variants below — content is identical
// everywhere; only the grid span (bento shape) differs per variant. Every
// card's accent bar renders the same grey/white/cyan gradient (bento-accent-bar
// in globals.css) — it no longer varies per card the way the old
// amber/blue/red accents did.
const CARD_CONTENT: CardMeta[] = [
  {
    href: "/explore",
    eyebrow: "Interactive pitch",
    title: "Explore the pitch",
    copy: "Switch between 8 formations, watch the shape change, and click any player to learn what their position actually does.",
    Demo: ExploreMiniPitch,
  },
  {
    href: "/tactics-lab",
    eyebrow: "Build & analyze",
    title: "Tactics Lab",
    copy: "Design your own formation, set team instructions, and get instant tactical feedback from a live analysis engine.",
    Demo: TacticsLabMiniCard,
  },
  {
    href: "/academy",
    eyebrow: "Learn",
    title: "Academy",
    copy: "Structured lessons on formations, positions, and tactics, with knowledge checks, XP, and badges as you go.",
    Demo: AcademyMiniCard,
  },
  {
    href: "/workouts",
    eyebrow: "Training",
    title: "Training Ground",
    copy: "Build your Player Card, get a four-week block built for your role, and train it one guided session at a time.",
    Demo: TrainingMiniCard,
  },
  {
    href: "/challenge",
    eyebrow: "Daily challenge",
    title: "Challenge",
    copy: "Random questions from every Academy module you've completed. One wrong answer resets the streak.",
    Demo: ChallengeMiniCard,
  },
  {
    href: "/managers",
    eyebrow: "Tactics history",
    title: "Managers",
    copy: "Profiles of the managers who shaped how the game is played, and the formations they made famous.",
    Demo: ManagersMiniCard,
  },
];

type CardTheme = "classic" | "glass" | "hud" | "glow";

// "classic" is the already-accepted Floodlit Pitch card look, unchanged —
// the other three extend the hero's established futuristic materials
// (glass panel, HUD corner brackets, cyan ambient glow) down into the grid.
const THEME_CLASSNAMES: Record<CardTheme, string> = {
  classic: "border-pitch-touchline/30 bg-pitch-card hover:border-transparent",
  glass: "border-white/15 bg-white/[0.04] backdrop-blur-xl hover:border-cyan-200/50 hover:bg-white/[0.07]",
  hud: "hud-frame border-cyan-300/20 bg-pitch-card hover:border-cyan-300/60",
  glow: "border-pitch-touchline/30 bg-pitch-card hover:border-cyan-300/50 hover:shadow-[0_0_32px_-8px_rgba(103,232,249,0.5)]",
};

function BentoCard({ meta, span, theme = "classic" }: { meta: CardMeta; span: string; theme?: CardTheme }) {
  const Demo = meta.Demo;
  const isFuturistic = theme !== "classic";
  return (
    <TiltCard
      href={meta.href}
      glowClassName={isFuturistic ? "border-grad-futurist" : "border-grad-kickoff"}
      className={`relative flex min-h-64 flex-col overflow-hidden rounded-lg border p-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker ${THEME_CLASSNAMES[theme]} ${span}`}
    >
      {/* Inner wrapper (not TiltCard's own root) owns the rise-in and
          hover-lift transforms so they never fight the root's Framer-driven
          tilt transform. */}
      <div className="bento-card-rise flex h-full flex-col gap-3 transition-transform duration-300 group-hover:-translate-y-1 group-focus-within:-translate-y-1">
        <span aria-hidden="true" className="bento-accent-bar absolute inset-x-0 top-0 h-1" />
        <p className="font-display text-xs font-semibold uppercase tracking-[0.12em] text-gold-flood">{meta.eyebrow}</p>
        <h2
          className={`font-display text-2xl font-bold uppercase leading-tight tracking-tight ${
            isFuturistic ? "text-white group-hover:text-cyan-200" : "text-pitch-line group-hover:text-gold-flood"
          }`}
        >
          {meta.title}
        </h2>
        <p className={`text-sm leading-relaxed ${isFuturistic ? "text-white/60" : "text-pitch-touchline"}`}>{meta.copy}</p>
        <div className="mt-auto pt-2">
          <Demo />
        </div>
      </div>
    </TiltCard>
  );
}

export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-16 px-4 py-10 sm:px-8 sm:py-16">
      <section className="hero-glass-panel relative flex flex-col gap-8 overflow-hidden rounded-2xl border border-white/15 p-6 backdrop-blur-xl sm:p-10 lg:flex-row lg:items-center lg:gap-12">
        <div aria-hidden="true" className="hero-shimmer-bar absolute inset-x-0 top-0 h-0.5" />
        <div className="flex flex-col gap-4 lg:flex-1">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200">
            [ Interactive football OS ]
          </p>
          <h1 className="font-display text-4xl font-black uppercase leading-none tracking-tight text-white sm:text-7xl">
            Know the shape.
            <br />
            Know your role.
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-white/60 sm:text-lg">
            Explore live formations, learn what every position does, train for your role, and
            study the managers who shaped how the game is played.
          </p>
          <MagneticButton
            href="/explore"
            className="hero-breathe-glow mt-2 inline-flex min-h-11 w-fit items-center justify-center gap-2 rounded-full border border-cyan-200/50 bg-white/5 px-6 font-display text-lg font-bold text-cyan-100 backdrop-blur-md transition-all hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
          >
            Explore the pitch →
          </MagneticButton>
        </div>

        <div className="relative mx-auto w-full max-w-xs sm:max-w-sm lg:mx-0 lg:max-w-sm">
          <div aria-hidden="true" className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] bg-cyan-300/10 blur-2xl" />
          <HeroPitch />
        </div>
      </section>

      <ChalkDivider />

      <section className="bento-grid grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CARD_CONTENT.map((meta) => (
          <BentoCard
            key={meta.href}
            meta={meta}
            theme="glow"
            span={
              meta.href === "/explore"
                ? "lg:col-span-2 lg:row-span-2"
                : meta.href === "/tactics-lab" || meta.href === "/challenge" || meta.href === "/managers"
                  ? "lg:col-span-2"
                  : ""
            }
          />
        ))}
      </section>
    </div>
  );
}
