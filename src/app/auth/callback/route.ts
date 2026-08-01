import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

/**
 * Where both the magic-link email and the Google OAuth redirect land.
 * Exchanges the one-time code for a session, then hands off to /join, which
 * owns the registration reveal (and, on the merge path, the friendly
 * merge-summary screen) rather than duplicating that here.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  // Render (and most reverse proxies) forward the request to this container
  // on an internal host/port (e.g. localhost:10000) — url.origin reflects
  // that internal address, not the public domain the browser actually hit.
  // The standard forwarded headers carry the real one.
  const forwardedHost = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const forwardedProto = request.headers.get("x-forwarded-proto") ?? url.protocol.replace(":", "");
  const origin = forwardedHost ? `${forwardedProto}://${forwardedHost}` : url.origin;
  const { searchParams } = url;
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/join";

  if (code) {
    const supabase = await getSupabaseServerClient();
    if (supabase) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  return NextResponse.redirect(`${origin}/login?error=link-expired`);
}
