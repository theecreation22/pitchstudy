export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Accounts are entirely optional (see .env.example) — every module that
 * touches Supabase checks this first and falls back to guest behavior
 * rather than erroring, the same graceful-absence pattern already used for
 * the Tactics Lab coach route's ANTHROPIC_API_KEY.
 */
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
