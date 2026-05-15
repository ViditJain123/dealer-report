"use client";

import { useTransition } from "react";

import {
  approveDeviceRequest,
  rejectDeviceRequest,
  resetDevice,
} from "@/app/actions/devices";
import { Button } from "@/components/ui/button";

/**
 * Distributor-side controls for a dealer's bound device, shown in the dealer
 * table. `pending` → Approve / Reject a device-change request; `active` →
 * Reset (unbind) the current device.
 */
export function DeviceActions({
  dealerId,
  variant,
}: {
  dealerId: string;
  variant: "pending" | "active";
}) {
  const [isPending, startTransition] = useTransition();

  if (variant === "pending") {
    return (
      <div className="flex gap-1.5">
        <Button
          size="sm"
          disabled={isPending}
          onClick={() =>
            startTransition(async () => {
              await approveDeviceRequest(dealerId);
            })
          }
        >
          Approve
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={isPending}
          onClick={() =>
            startTransition(async () => {
              await rejectDeviceRequest(dealerId);
            })
          }
        >
          Reject
        </Button>
      </div>
    );
  }

  return (
    <Button
      size="sm"
      variant="ghost"
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          await resetDevice(dealerId);
        })
      }
    >
      Reset device
    </Button>
  );
}
