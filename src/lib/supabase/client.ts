"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { isSupabaseConfigured, SUPABASE_ANON_KEY, SUPABASE_URL } from "./config";

let cached: SupabaseClient | null = null;

/** Returns `null` when accounts aren't configured — every call site must handle that by falling back to guest behavior, never an error. Memoized so we don't spin up a second GoTrueClient per call. */
export function getSupabaseBrowserClient(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  if (!cached) cached = createBrowserClient(SUPABASE_URL!, SUPABASE_ANON_KEY!);
  return cached;
}
