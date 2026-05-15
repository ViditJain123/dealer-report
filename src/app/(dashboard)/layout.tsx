import type { ReactNode } from "react";

import { DashboardShell } from "@/components/dashboard/DashboardShell";

/** Wraps every authenticated dashboard route in the sidebar app shell. */
export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
