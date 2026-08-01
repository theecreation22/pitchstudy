import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured, SUPABASE_ANON_KEY, SUPABASE_URL } from "./config";

/**
 * Refreshes the Supabase session cookie on every request — nothing more.
 * Never redirects, never gates a route: accounts sync progress, they don't
 * unlock anything, so there's no "not signed in" case for this middleware
 * to enforce.
 */
export async function updateSupabaseSession(request: NextRequest): Promise<NextResponse> {
  const response = NextResponse.next({ request });
  if (!isSupabaseConfigured) return response;

  const supabase = createServerClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  // Touches the session so an expiring token gets refreshed before it's
  // used elsewhere in the request — the return value itself isn't needed.
  await supabase.auth.getUser();

  return response;
}
