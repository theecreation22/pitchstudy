import type { Metadata } from "next";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export const metadata: Metadata = {
  title: "Admin · PitchStudy",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-10 sm:px-8 sm:py-16">
      <header className="flex flex-col gap-3">
        <p className="font-mono text-xs uppercase tracking-widest text-attack">Admin</p>
        <h1 className="font-display text-4xl font-black uppercase leading-none tracking-tight text-pitch-line sm:text-6xl">
          Club office.
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-pitch-touchline sm:text-lg">
          Aggregate site stats and the registered user list — nothing beyond username, email, and signup date.
        </p>
      </header>
      <AdminDashboard />
    </div>
  );
}
