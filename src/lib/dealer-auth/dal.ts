import "server-only";

import { getSupabaseClient } from "@/lib/supabase/server";
import { verifyDealerSession } from "@/lib/dealer-auth/session";

/**
 * Dealer Data Access Layer — resolves a bearer token to the dealer behind it.
 * The chokepoint for authenticated dealer API routes.
 */

export type DealerProfile = {
  id: string;
  dealerName: string;
  dealerCode: string;
  phoneNumber: string;
  distributorId: string;
};

/**
 * Resolves an `Authorization: Bearer` token to the dealer's profile, or null
 * when the token is missing, invalid, or expired.
 */
export async function getDealerFromSession(
  bearerToken: string | null | undefined,
): Promise<DealerProfile | null> {
  if (!bearerToken) {
    return null;
  }
  const dealerId = await verifyDealerSession(bearerToken);
  if (!dealerId) {
    return null;
  }

  const supabase = getSupabaseClient();
  const { data } = await supabase
    .from("dealers")
    .select("id, dealer_name, dealer_code, phone_number, distributor_id")
    .eq("id", dealerId)
    .maybeSingle();

  if (!data) {
    return null;
  }
  return {
    id: data.id,
    dealerName: data.dealer_name,
    dealerCode: data.dealer_code,
    phoneNumber: data.phone_number,
    distributorId: data.distributor_id,
  };
}
