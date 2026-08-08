import type { Metadata } from "next";
import { SetPasswordForm } from "@/components/auth/SetPasswordForm";

export const metadata: Metadata = {
  title: "Set a new password · PitchStudy",
  description: "Choose a new password for your PitchStudy account.",
  robots: { index: false, follow: false },
};

export default function ResetPasswordPage() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col gap-8 px-4 py-16">
      <header className="flex flex-col gap-1">
        <p className="font-mono text-xs uppercase tracking-widest text-attack">Account</p>
        <h1 className="font-display text-3xl font-black uppercase leading-none tracking-tight text-pitch-line sm:text-4xl">
          New password.
        </h1>
      </header>
      <SetPasswordForm />
    </div>
  );
}
