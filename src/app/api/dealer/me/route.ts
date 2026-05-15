import { NextResponse, type NextRequest } from "next/server";

import { getDealerFromSession } from "@/lib/dealer-auth/dal";
import { getBearerToken } from "@/lib/dealer-auth/http";

export const dynamic = "force-dynamic";

/**
 * Returns the signed-in dealer for a valid `Authorization: Bearer` token.
 * The template for future authenticated dealer endpoints.
 */
export async function GET(request: NextRequest) {
  const dealer = await getDealerFromSession(getBearerToken(request));
  if (!dealer) {
    return NextResponse.json(
      { ok: false, error: "Unauthenticated." },
      { status: 401 },
    );
  }
  return NextResponse.json({
    ok: true,
    dealer: {
      id: dealer.id,
      dealerName: dealer.dealerName,
      dealerCode: dealer.dealerCode,
      phoneNumber: dealer.phoneNumber,
    },
  });
}
