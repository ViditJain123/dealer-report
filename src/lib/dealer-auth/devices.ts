import "server-only";

import { getSupabaseClient } from "@/lib/supabase/server";
import { deleteAllDealerSessions } from "@/lib/dealer-auth/session";

/**
 * Device binding — a dealer account is tied to one device.
 *
 * `dealer_devices` holds at most one `active` row (the bound device) and at
 * most one `pending` row (a device-change request awaiting distributor
 * approval) per dealer.
 */

export type DeviceLoginResult = "first-bind" | "bound" | "pending";

/**
 * Resolves a login attempt's device against the dealer's bound device.
 *  - `first-bind`: no device was bound — this one is auto-bound (active).
 *  - `bound`: this device is already the dealer's active device.
 *  - `pending`: a different device — a pending change request is recorded.
 */
export async function resolveDeviceLogin(
  dealerId: string,
  deviceId: string,
  deviceLabel: string,
): Promise<DeviceLoginResult> {
  const supabase = getSupabaseClient();

  const { data: active } = await supabase
    .from("dealer_devices")
    .select("device_id")
    .eq("dealer_id", dealerId)
    .eq("status", "active")
    .maybeSingle();

  if (!active) {
    const { error } = await supabase.from("dealer_devices").insert({
      dealer_id: dealerId,
      device_id: deviceId,
      device_label: deviceLabel,
      status: "active",
      approved_at: new Date().toISOString(),
    });
    if (error) {
      throw new Error(`Failed to bind device: ${error.message}`);
    }
    return "first-bind";
  }

  if (active.device_id === deviceId) {
    return "bound";
  }

  // A different device — replace any prior pending request with this one.
  await supabase
    .from("dealer_devices")
    .delete()
    .eq("dealer_id", dealerId)
    .eq("status", "pending");
  const { error } = await supabase.from("dealer_devices").insert({
    dealer_id: dealerId,
    device_id: deviceId,
    device_label: deviceLabel,
    status: "pending",
  });
  if (error) {
    throw new Error(`Failed to record device-change request: ${error.message}`);
  }
  return "pending";
}

/**
 * Approves a dealer's pending device: it becomes the active device, the old
 * one is dropped, and the dealer's existing sessions are revoked.
 */
export async function approveDeviceRequest(dealerId: string): Promise<void> {
  const supabase = getSupabaseClient();

  const { data: pending } = await supabase
    .from("dealer_devices")
    .select("id")
    .eq("dealer_id", dealerId)
    .eq("status", "pending")
    .maybeSingle();
  if (!pending) {
    return;
  }

  // Drop the old active device first so the one-active-per-dealer index holds.
  await supabase
    .from("dealer_devices")
    .delete()
    .eq("dealer_id", dealerId)
    .eq("status", "active");
  await supabase
    .from("dealer_devices")
    .update({ status: "active", approved_at: new Date().toISOString() })
    .eq("id", pending.id);

  // The old device's sessions are no longer valid.
  await deleteAllDealerSessions(dealerId);
}

/** Discards a dealer's pending device-change request. */
export async function rejectDeviceRequest(dealerId: string): Promise<void> {
  const supabase = getSupabaseClient();
  await supabase
    .from("dealer_devices")
    .delete()
    .eq("dealer_id", dealerId)
    .eq("status", "pending");
}

/**
 * Unbinds a dealer's device entirely (e.g. a lost phone) and revokes their
 * sessions. The dealer's next login auto-binds the device they sign in from.
 */
export async function resetDevice(dealerId: string): Promise<void> {
  const supabase = getSupabaseClient();
  await supabase.from("dealer_devices").delete().eq("dealer_id", dealerId);
  await deleteAllDealerSessions(dealerId);
}

export type DealerDeviceStatus = {
  active: { deviceLabel: string } | null;
  pending: { deviceLabel: string; requestedAt: string } | null;
};

/** Device status for a set of dealers, keyed by dealer id. */
export async function getDeviceStatusByDealer(
  dealerIds: string[],
): Promise<Map<string, DealerDeviceStatus>> {
  const result = new Map<string, DealerDeviceStatus>();
  for (const id of dealerIds) {
    result.set(id, { active: null, pending: null });
  }
  if (dealerIds.length === 0) {
    return result;
  }

  const supabase = getSupabaseClient();
  const { data } = await supabase
    .from("dealer_devices")
    .select("dealer_id, device_label, status, created_at")
    .in("dealer_id", dealerIds);

  for (const row of data ?? []) {
    const entry = result.get(row.dealer_id);
    if (!entry) {
      continue;
    }
    if (row.status === "active") {
      entry.active = { deviceLabel: row.device_label };
    } else if (row.status === "pending") {
      entry.pending = { deviceLabel: row.device_label, requestedAt: row.created_at };
    }
  }
  return result;
}
