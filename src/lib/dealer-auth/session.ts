import "server-only";

import { getSupabaseClient } from "@/lib/supabase/server";
import { generateSessionToken, hashToken } from "@/lib/auth/tokens";
import { DEALER_SESSION_TTL_MS } from "@/lib/dealer-auth/constants";

/**
 * Dealer app sessions — opaque, database-backed bearer tokens.
 *
 * The React Native app stores the raw token in expo-secure-store and sends it
 * as `Authorization: Bearer <token>`; the database stores only its SHA-256 hash.
 */

/** Creates a `dealer_sessions` row and returns the raw bearer token. */
export async function createDealerSession(dealerId: string): Promise<string> {
  const token = generateSessionToken();
  const supabase = getSupabaseClient();
  const { error } = await supabase.from("dealer_sessions").insert({
    dealer_id: dealerId,
    token_hash: hashToken(token),
    expires_at: new Date(Date.now() + DEALER_SESSION_TTL_MS).toISOString(),
  });
  if (error) {
    throw new Error(`Failed to create dealer session: ${error.message}`);
  }
  return token;
}

/** Resolves a bearer token to its dealer id, or null when invalid/expired. */
export async function verifyDealerSession(token: string): Promise<string | null> {
  const supabase = getSupabaseClient();
  const { data } = await supabase
    .from("dealer_sessions")
    .select("dealer_id, expires_at")
    .eq("token_hash", hashToken(token))
    .maybeSingle();

  if (!data || new Date(data.expires_at) <= new Date()) {
    return null;
  }
  return data.dealer_id;
}

/** Deletes a single dealer session by its bearer token (idempotent). */
export async function deleteDealerSession(token: string): Promise<void> {
  const supabase = getSupabaseClient();
  await supabase.from("dealer_sessions").delete().eq("token_hash", hashToken(token));
}

/** Deletes every session for a dealer — used when their bound device changes. */
export async function deleteAllDealerSessions(dealerId: string): Promise<void> {
  const supabase = getSupabaseClient();
  await supabase.from("dealer_sessions").delete().eq("dealer_id", dealerId);
}
