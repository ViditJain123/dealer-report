"use server";

import { revalidatePath } from "next/cache";

import { verifySession } from "@/lib/auth/dal";
import { getSupabaseClient } from "@/lib/supabase/server";
import {
  approveDeviceRequest as approveDevice,
  rejectDeviceRequest as rejectDevice,
  resetDevice as unbindDevice,
} from "@/lib/dealer-auth/devices";

/**
 * Server Actions for the distributor to manage a dealer's bound device from the
 * Settings page. Each action confirms the dealer belongs to the signed-in
 * distributor before touching anything.
 */

/** Throws unless the signed-in distributor owns the given dealer. */
async function assertOwnsDealer(dealerId: string): Promise<void> {
  const { distributorId } = await verifySession();
  const supabase = getSupabaseClient();
  const { data } = await supabase
    .from("dealers")
    .select("id")
    .eq("id", dealerId)
    .eq("distributor_id", distributorId)
    .maybeSingle();
  if (!data) {
    throw new Error("Dealer not found.");
  }
}

/** Approves a dealer's pending device-change request. */
export async function approveDeviceRequest(dealerId: string): Promise<void> {
  await assertOwnsDealer(dealerId);
  await approveDevice(dealerId);
  revalidatePath("/dashboard/settings");
}

/** Rejects (discards) a dealer's pending device-change request. */
export async function rejectDeviceRequest(dealerId: string): Promise<void> {
  await assertOwnsDealer(dealerId);
  await rejectDevice(dealerId);
  revalidatePath("/dashboard/settings");
}

/** Unbinds a dealer's device (e.g. a lost phone) — their next login re-binds. */
export async function resetDevice(dealerId: string): Promise<void> {
  await assertOwnsDealer(dealerId);
  await unbindDevice(dealerId);
  revalidatePath("/dashboard/settings");
}
