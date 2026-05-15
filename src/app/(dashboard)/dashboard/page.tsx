import { redirect } from "next/navigation";

/** The dashboard has no landing view yet — send users straight to Settings. */
export default function DashboardPage() {
  redirect("/dashboard/settings");
}
