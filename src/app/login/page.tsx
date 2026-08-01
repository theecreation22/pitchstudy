import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Log in · PitchStudy",
  description: "Sign back in to sync your Player Card, progress, and playbook across devices.",
};

export default function LoginPage() {
  return (
    <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-8 px-4 py-16">
      <header className="flex flex-col gap-2 text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-attack">Welcome back</p>
        <h1 className="font-display text-3xl font-black uppercase leading-none tracking-tight text-pitch-line">
          Back to the club.
        </h1>
      </header>
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
