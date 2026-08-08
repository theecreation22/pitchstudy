"use client";

/** Everything this app stores locally is namespaced under this prefix. */
const APP_PREFIX = "pitchstudy:";

export type ExportBundle = {
  exportedAt: string;
  source: string;
  data: Record<string, unknown>;
};

/**
 * Collects everything the app has stored on this device.
 *
 * Deliberately filtered to the app's own prefix rather than dumping
 * localStorage wholesale: Supabase writes auth material under its own `sb-`
 * keys, and a "download my data" button must never hand the user a file
 * containing their own session tokens.
 *
 * Values are JSON-parsed where possible so the export is readable rather than
 * a wall of escaped strings.
 */
export function collectExport(): ExportBundle {
  const data: Record<string, unknown> = {};

  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);
    if (!key?.startsWith(APP_PREFIX)) continue;

    const raw = localStorage.getItem(key);
    if (raw === null) continue;

    try {
      data[key] = JSON.parse(raw);
    } catch {
      data[key] = raw;
    }
  }

  return { exportedAt: new Date().toISOString(), source: "PitchStudy", data };
}

/** Triggers a download of the bundle. Uses an object URL rather than a data: URI, which some browsers cap at a size a full playbook can exceed. */
export function downloadExport(): void {
  const bundle = collectExport();
  const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `pitchstudy-data-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  URL.revokeObjectURL(url);
}
