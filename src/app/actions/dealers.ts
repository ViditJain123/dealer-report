"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getSupabaseClient } from "@/lib/supabase/server";
import { verifySession } from "@/lib/auth/dal";
import { hashPassword } from "@/lib/auth/password";
import { AddDealerSchema, type FormState } from "@/lib/auth/validation";

/**
 * Server Action for onboarding a dealer. Written for `useActionState`; returns
 * `{ ok: true }` so the add-dealer dialog can close itself on success.
 */
export async function addDealer(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  // Redirects to /login if there is no valid session.
  const { distributorId } = await verifySession();

  const parsed = AddDealerSchema.safeParse({
    dealerName: formData.get("dealerName"),
    dealerCode: formData.get("dealerCode"),
    password: formData.get("password"),
    phoneNumber: formData.get("phoneNumber"),
  });
  if (!parsed.success) {
    return { errors: z.flattenError(parsed.error).fieldErrors };
  }

  const supabase = getSupabaseClient();
  const passwordHash = await hashPassword(parsed.data.password);

  const { error } = await supabase.from("dealers").insert({
    distributor_id: distributorId,
    dealer_name: parsed.data.dealerName,
    dealer_code: parsed.data.dealerCode,
    password_hash: passwordHash,
    phone_number: parsed.data.phoneNumber,
  });

  if (error) {
    // 23505 here can only be the (distributor_id, dealer_code) unique constraint.
    if (error.code === "23505") {
      return {
        errors: { dealerCode: ["This dealer code is already in use. Choose another."] },
      };
    }
    return { message: "Could not add the dealer. Please try again." };
  }

  revalidatePath("/dashboard/settings");
  return { ok: true };
}
