import { HeroPitch } from "@/components/home/HeroPitch";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { TiltCard } from "@/components/motion/TiltCard";

const sections = [
  {
    eyebrow: "Interactive pitch",
    title: "Explore the pitch",
    copy: "Switch between 8 formations, watch the shape change, and click any player to learn what their position actually does.",
    href: "/explore",
  },
  {
    eyebrow: "Training",
    title: "Workouts",
    copy: "Four-week plans for every position group — strength, speed, endurance, and position-specific drills.",
    href: "/workouts",
  },
  {
    eyebrow: "Tactics history",
    title: "Managers",
    copy: "Profiles of the managers who shaped how the game is played, and the formations they made famous.",
    href: "/managers",
  },
  {
    eyebrow: "Test yourself",
    title: "Quiz",
    copy: "Short quizzes on formations, positions, and managers with instant feedback — no accounts needed.",
    href: "/quiz",
  },
];

export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-16 px-4 py-10 sm:px-8 sm:py-16">
      <section className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-12">
        <div className="flex flex-col gap-4 lg:flex-1">
          <p className="font-display text-sm font-semibold uppercase tracking-[0.15em] text-gold-flood">
            Interactive football education
          </p>
          <h1 className="text-grad-kickoff font-display text-4xl font-black uppercase leading-none tracking-tight sm:text-6xl">
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
            className="mt-2 inline-flex min-h-11 w-fit items-center justify-center rounded-md bg-gold-flood px-6 font-display text-lg font-bold text-night-950 transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-line"
          >
            Explore the pitch →
          </MagneticButton>
        </div>

        <div className="mx-auto w-full max-w-xs sm:max-w-sm lg:mx-0 lg:max-w-sm">
          <HeroPitch />
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        {sections.map((section) => (
          <TiltCard
            key={section.href}
            href={section.href}
            className="flex flex-col gap-3 rounded-lg border border-pitch-touchline/30 bg-pitch-card p-6 transition-colors hover:border-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pitch-marker"
          >
            <p className="font-display text-xs font-semibold uppercase tracking-[0.12em] text-gold-flood">
              {section.eyebrow}
            </p>
            <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-pitch-line group-hover:text-gold-flood">
              {section.title}
            </h2>
            <p className="text-sm leading-relaxed text-pitch-touchline">{section.copy}</p>
          </TiltCard>
        ))}
      </section>
    </div>
  );
}
