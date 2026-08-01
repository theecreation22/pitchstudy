import type { Metadata } from "next";
import { JoinFlow } from "@/components/auth/JoinFlow";

export const metadata: Metadata = {
  title: "Join the Club · PitchStudy",
  description: "Optionally register to carry your Player Card, progress, and playbook across devices.",
};

export default function JoinPage() {
  return (
    <div className="relative mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-4 py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[60vmax] w-[60vmax] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, var(--attack) 0%, transparent 70%)", opacity: 0.1 }}
      />
      <div className="tactics-panel border-grad-kickoff w-full rounded-2xl p-8 sm:p-12">
        <JoinFlow />
      </div>
    </div>
  );
}
