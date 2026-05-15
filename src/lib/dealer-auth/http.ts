import "server-only";

import type { NextRequest } from "next/server";

/** Extracts the token from an `Authorization: Bearer <token>` request header. */
export function getBearerToken(request: NextRequest): string | null {
  const header = request.headers.get("authorization");
  if (!header) {
    return null;
  }
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : null;
}
