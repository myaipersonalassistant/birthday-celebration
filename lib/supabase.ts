import { createClient, SupabaseClient } from "@supabase/supabase-js";

function getSupabaseCredentials() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!url || !key) {
    throw new Error(
      "Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }

  return { url, key };
}

/** Fresh client for server actions — avoids stale shared connections. */
export function createSupabaseServerClient() {
  const { url, key } = getSupabaseCredentials();
  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

let browserClient: SupabaseClient | null = null;

/** Shared client for browser/client components if needed. */
export function getSupabase() {
  if (typeof window === "undefined") {
    return createSupabaseServerClient();
  }

  if (!browserClient) {
    const { url, key } = getSupabaseCredentials();
    browserClient = createClient(url, key);
  }

  return browserClient;
}
