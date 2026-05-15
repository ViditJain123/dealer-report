import { NextResponse, type NextRequest } from "next/server";

import { SESSION_COOKIE } from "@/lib/auth/constants";

/**
 * Proxy (Next.js 16's renamed Middleware) — optimistic route protection.
 *
 * It only checks whether a session cookie is present; it never touches the
 * database. Real authentication happens in the Data Access Layer
 * (`verifySession`). This just keeps signed-out users off `/dashboard` and
 * signed-in users off the auth pages, before any page renders.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = Boolean(request.cookies.get(SESSION_COOKIE)?.value);

  const isDashboard =
    pathname === "/dashboard" || pathname.startsWith("/dashboard/");
  const isAuthPage = pathname === "/login" || pathname === "/signup";

  if (isDashboard && !hasSession) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (isAuthPage && hasSession) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*", "/login", "/signup"],
};
