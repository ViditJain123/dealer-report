import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";

import { getSupabaseClient } from "@/lib/supabase/server";
import { getSessionToken } from "@/lib/auth/session";
import { hashToken } from "@/lib/auth/tokens";
import type { Dealer } from "@/lib/supabase/types";

/**
 * Data Access Layer — the single chokepoint for authenticated reads.
 *
 * Every authenticated Server Component / Server Action should resolve the
 * current distributor through `verifySession()` rather than reading cookies or
 * the database directly.
 */

export type SessionDistributor = {
  distributorId: string;
  email: string;
  fullName: string;
};

/**
 * Resolves the signed-in distributor from the request's session cookie.
 * Redirects to `/login` when there is no valid, unexpired session.
 *
 * Memoized with React `cache()`, so calling it from both a layout and a page
 * in the same render costs a single pair of database queries.
 */
export const verifySession = cache(async (): Promise<SessionDistributor> => {
  const token = await getSessionToken();
  if (!token) {
    redirect("/login");
  }

  const supabase = getSupabaseClient();

  const { data: session } = await supabase
    .from("sessions")
    .select("distributor_id, expires_at")
    .eq("token_hash", hashToken(token))
    .maybeSingle();

  if (!session || new Date(session.expires_at) <= new Date()) {
    redirect("/login");
  }

  const { data: distributor } = await supabase
    .from("distributors")
    .select("id, email, full_name")
    .eq("id", session.distributor_id)
    .maybeSingle();

  if (!distributor) {
    redirect("/login");
  }

  return {
    distributorId: distributor.id,
    email: distributor.email,
    fullName: distributor.full_name,
  };
});

/** Returns the distributor's dealers, newest first. */
export async function getDealers(distributorId: string): Promise<Dealer[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("dealers")
    .select("*")
    .eq("distributor_id", distributorId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to load dealers: ${error.message}`);
  }
  return data ?? [];
}
