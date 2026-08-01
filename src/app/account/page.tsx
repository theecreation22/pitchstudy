import type { Metadata } from "next";
import { AccountView } from "@/components/auth/AccountView";

export const metadata: Metadata = {
  title: "Account · PitchStudy",
  description: "Manage your PitchStudy account and cloud sync.",
};

export default function AccountPage() {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-8 px-4 py-16">
      <header className="flex flex-col gap-1">
        <p className="font-mono text-xs uppercase tracking-widest text-attack">Your account</p>
        <h1 className="font-display text-3xl font-black uppercase leading-none tracking-tight text-pitch-line sm:text-4xl">
          Club membership.
        </h1>
      </header>
      <AccountView />
    </div>
  );
}
