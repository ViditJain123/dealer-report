import "server-only";

import { cookies } from "next/headers";

import { getSupabaseClient } from "@/lib/supabase/server";
import { SESSION_COOKIE, SESSION_TTL_MS } from "@/lib/auth/constants";
import { generateSessionToken, hashToken } from "@/lib/auth/tokens";

/**
 * Distributor web sessions — opaque, database-backed.
 *
 * A random token is handed to the client in an HttpOnly cookie; the database
 * stores only its SHA-256 hash. There is no JWT and no signing secret. The
 * token helpers are shared with dealer sessions — see `@/lib/auth/tokens`.
 */

/** Reads the raw session token from the request cookie, if present. */
export async function getSessionToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value;
}

/**
 * Creates a session row for the distributor and sets the session cookie.
 * Call after credentials have been verified.
 */
export async function createSession(distributorId: string): Promise<void> {
  const token = generateSessionToken();
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  const supabase = getSupabaseClient();
  const { error } = await supabase.from("sessions").insert({
    distributor_id: distributorId,
    token_hash: hashToken(token),
    expires_at: expiresAt.toISOString(),
  });
  if (error) {
    throw new Error(`Failed to create session: ${error.message}`);
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    // Allow the cookie over plain HTTP in local dev (the dev server is not TLS).
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

/** Deletes the current session row (if any) and clears the cookie. */
export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (token) {
    const supabase = getSupabaseClient();
    await supabase.from("sessions").delete().eq("token_hash", hashToken(token));
  }
  cookieStore.delete(SESSION_COOKIE);
}
