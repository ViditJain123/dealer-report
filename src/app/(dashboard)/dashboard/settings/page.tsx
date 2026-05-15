import type { Metadata } from "next";
import { Users } from "lucide-react";

import { AddDealerDialog } from "@/components/dashboard/AddDealerDialog";
import { DealerTable } from "@/components/dashboard/DealerTable";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { getDealers, verifySession } from "@/lib/auth/dal";
import { getDeviceStatusByDealer } from "@/lib/dealer-auth/devices";

export const metadata: Metadata = { title: "Settings · Dealer Report" };

export default async function SettingsPage() {
  const { distributorId } = await verifySession();
  const dealers = await getDealers(distributorId);
  const deviceStatus = await getDeviceStatusByDealer(dealers.map((d) => d.id));
  const pendingCount = [...deviceStatus.values()].filter((s) => s.pending).length;

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 p-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-title font-semibold text-foreground">Settings</h1>
        <p className="text-body text-muted-foreground">
          Manage your account and dealers.
        </p>
      </header>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-0.5">
            <h2 className="text-heading font-semibold text-foreground">Dealers</h2>
            <p className="text-body text-muted-foreground">
              {dealers.length} {dealers.length === 1 ? "dealer" : "dealers"}
              {pendingCount > 0
                ? ` · ${pendingCount} device ${
                    pendingCount === 1 ? "request" : "requests"
                  } pending approval`
                : ""}
            </p>
          </div>
          {dealers.length > 0 ? <AddDealerDialog /> : null}
        </div>

        {dealers.length === 0 ? (
          <EmptyState
            icon={<Users className="size-8" />}
            title="No dealers yet"
            description="Add your first dealer to give them access to the mobile app."
            action={<AddDealerDialog />}
          />
        ) : (
          <DealerTable dealers={dealers} deviceStatus={deviceStatus} />
        )}
      </section>
    </div>
  );
}
