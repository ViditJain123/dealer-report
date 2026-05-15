import type { ReactNode } from "react";

import { verifySession } from "@/lib/auth/dal";
import { Sidebar } from "@/components/dashboard/Sidebar";

/**
 * App shell for every authenticated dashboard route: a fixed {@link Sidebar}
 * next to a scrollable content area. Resolves the session itself, so any route
 * rendered inside it is guaranteed to have a signed-in distributor.
 */
export async function DashboardShell({ children }: { children: ReactNode }) {
  const { email } = await verifySession();

  return (
    <div className="flex min-h-dvh">
      <Sidebar distributorEmail={email} />
      <main className="flex-1 overflow-y-auto bg-background">{children}</main>
    </div>
  );
}
