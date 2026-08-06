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

function BentoCard({ meta, span }: { meta: CardMeta; span: string }) {
  const Demo = meta.Demo;
  return (
    <TiltCard
      href={meta.href}
      glowClassName="border-grad-futurist"
      className={`telemetry-frame telemetry-panel-lift relative flex min-h-64 flex-col overflow-hidden rounded-lg border border-pitch-touchline/30 bg-pitch-card p-6 hover:border-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker ${span}`}
    >
      <span aria-hidden="true" className="telemetry-corner telemetry-corner-tl" />
      <span aria-hidden="true" className="telemetry-corner telemetry-corner-tr" />
      {/* Inner wrapper (not TiltCard's own root) owns the rise-in and
          hover-lift transforms so they never fight the root's Framer-driven
          tilt transform. */}
      <div className="bento-card-rise flex h-full flex-col gap-3 transition-transform duration-300 group-hover:-translate-y-1 group-focus-within:-translate-y-1">
        <span aria-hidden="true" className="bento-accent-bar absolute inset-x-0 top-0 h-1" />
        <p className="font-display text-xs font-semibold uppercase tracking-[0.12em] text-telemetry-olive">{meta.eyebrow}</p>
        <h2 className="font-display text-2xl font-bold uppercase leading-tight tracking-tight text-pitch-line group-hover:text-pitch-marker">
          {meta.title}
        </h2>
        <p className="text-sm leading-relaxed text-pitch-touchline">{meta.copy}</p>
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
      <section className="telemetry-frame telemetry-glass relative flex flex-col gap-8 overflow-hidden rounded-2xl border p-6 sm:p-10 lg:flex-row lg:items-center lg:gap-12">
        <span aria-hidden="true" className="telemetry-corner telemetry-corner-tl" />
        <span aria-hidden="true" className="telemetry-corner telemetry-corner-tr" />
        <span aria-hidden="true" className="telemetry-corner telemetry-corner-bl" />
        <span aria-hidden="true" className="telemetry-corner telemetry-corner-br" />
        <div aria-hidden="true" className="hero-shimmer-bar absolute inset-x-0 top-0 h-0.5" />
        <div className="flex flex-col gap-4 lg:flex-1">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-telemetry-olive sm:tracking-[0.3em]">
            [ Interactive football OS ]
          </p>
          <h1 className="font-telemetry-display text-4xl font-black leading-none tracking-tight text-pitch-line sm:text-7xl">
            Know the shape.
            <br />
            Know your role.
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-pitch-touchline sm:text-lg">
            Explore live formations, learn what every position does, train for your role, and
            study the managers who shaped how the game is played.
          </p>
          <MagneticButton
            href="/explore"
            className="telemetry-panel-lift mt-2 inline-flex min-h-11 w-fit items-center justify-center gap-2 rounded-full bg-attack px-6 font-display text-lg font-bold text-night-950 transition-transform hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker"
          >
            Explore the pitch →
          </MagneticButton>
        </div>

        <div className="relative mx-auto w-full max-w-xs sm:max-w-sm lg:mx-0 lg:max-w-sm">
          <div aria-hidden="true" className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] bg-telemetry-olive/10 blur-2xl" />
          <HeroPitch />
        </div>
      </section>

      <ChalkDivider />

      <section className="bento-grid grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CARD_CONTENT.map((meta) => (
          <BentoCard
            key={meta.href}
            meta={meta}
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
