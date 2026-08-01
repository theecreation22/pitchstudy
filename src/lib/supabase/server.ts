import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { SupabaseClient } from "@supabase/supabase-js";
import { isSupabaseConfigured, SUPABASE_ANON_KEY, SUPABASE_URL } from "./config";

/**
 * For Route Handlers and Server Components only (uses `next/headers`).
 * Returns `null` when accounts aren't configured. A fresh client per request
 * is intentional here — unlike the browser singleton, this one is bound to
 * the current request's cookie jar and can't be reused across requests.
 */
export async function getSupabaseServerClient(): Promise<SupabaseClient | null> {
  if (!isSupabaseConfigured) return null;
  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Called from a Server Component that can't set cookies — the
          // middleware below already refreshes the session on every request,
          // so a missed set here just means this one render uses the
          // pre-refresh session, not a broken one.
        }
      },
    },
  });
}
