import type { Metadata } from "next";
import { JoinFlow } from "@/components/auth/JoinFlow";

export const metadata: Metadata = {
  title: "Join the Club · PitchStudy",
  description: "Optionally register to carry your Player Card, progress, and playbook across devices.",
};

export default function JoinPage() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-8 px-4 py-16">
      <JoinFlow />
    </div>
  );
}
