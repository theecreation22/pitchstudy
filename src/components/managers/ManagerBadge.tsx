function getInitials(name: string): string {
  return name
    .split(" ")
    .filter((part) => /^[A-ZÀ-Ý]/.test(part))
    .map((part) => part[0])
    .join("")
    .slice(0, 2);
}

export function ManagerBadge({ name, size = "md" }: { name: string; size?: "md" | "lg" }) {
  const dimension = size === "lg" ? "h-20 w-20 text-2xl" : "h-14 w-14 text-lg";

  return (
    <div
      aria-hidden="true"
      className={`flex ${dimension} shrink-0 items-center justify-center rounded-full border border-pitch-marker/60 bg-pitch-slate font-display font-bold uppercase tracking-wide text-pitch-marker`}
    >
      {getInitials(name)}
    </div>
  );
}
