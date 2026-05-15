import { redirect } from "next/navigation";

/**
 * Root route. The app has no public landing page yet — send visitors to login.
 * (An already-signed-in distributor is bounced on to the dashboard by the proxy
 * when they reach `/login`.)
 */
export default function Home() {
  redirect("/login");
}
