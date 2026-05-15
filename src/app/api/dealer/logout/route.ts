import { NextResponse, type NextRequest } from "next/server";

import { getBearerToken } from "@/lib/dealer-auth/http";
import { deleteDealerSession } from "@/lib/dealer-auth/session";

export const dynamic = "force-dynamic";

/** Ends the current dealer session. Idempotent — always returns `{ ok: true }`. */
export async function POST(request: NextRequest) {
  const token = getBearerToken(request);
  if (token) {
    await deleteDealerSession(token);
  }
  return NextResponse.json({ ok: true });
}
