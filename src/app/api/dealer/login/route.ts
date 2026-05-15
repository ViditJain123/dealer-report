import { NextResponse, type NextRequest } from "next/server";

import { getSupabaseClient } from "@/lib/supabase/server";
import { verifyPassword } from "@/lib/auth/password";
import { DUMMY_PASSWORD_HASH } from "@/lib/dealer-auth/constants";
import { resolveDeviceLogin } from "@/lib/dealer-auth/devices";
import { createDealerSession } from "@/lib/dealer-auth/session";
import { DealerLoginSchema } from "@/lib/dealer-auth/validation";

// Authentication must always run at request time.
export const dynamic = "force-dynamic";

/**
 * Dealer login for the React Native app.
 *
 * Body: `{ phoneNumber, dealerCode, password, deviceId, deviceLabel? }`.
 * The phone number identifies the dealer; dealer code + password authenticate.
 * The device is then bound (first login), accepted (known device), or — for a
 * new device — recorded as a pending request and the login is refused.
 */
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 },
    );
  }

  const parsed = DealerLoginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Enter your phone number, dealer code, and password." },
      { status: 400 },
    );
  }
  const { phoneNumber, dealerCode, password, deviceId, deviceLabel } = parsed.data;

  const supabase = getSupabaseClient();
  const { data: dealer } = await supabase
    .from("dealers")
    .select("id, dealer_name, dealer_code, password_hash")
    .eq("phone_number", phoneNumber)
    .maybeSingle();

  // Always run a hash verify — even on an unknown phone — to keep login timing
  // uniform, so it cannot be used to discover which numbers are registered.
  const passwordOk = await verifyPassword(
    password,
    dealer?.password_hash ?? DUMMY_PASSWORD_HASH,
  );

  if (!dealer || !passwordOk || dealer.dealer_code !== dealerCode) {
    return NextResponse.json(
      { ok: false, error: "Invalid phone number, dealer code, or password." },
      { status: 401 },
    );
  }

  const deviceResult = await resolveDeviceLogin(
    dealer.id,
    deviceId,
    deviceLabel ?? "",
  );

  if (deviceResult === "pending") {
    return NextResponse.json(
      {
        ok: false,
        status: "device_pending",
        error:
          "This device needs approval from your distributor before you can sign in. " +
          "Once they approve it, sign in again.",
      },
      { status: 403 },
    );
  }

  const token = await createDealerSession(dealer.id);
  return NextResponse.json({
    ok: true,
    token,
    dealer: {
      id: dealer.id,
      dealerName: dealer.dealer_name,
      dealerCode: dealer.dealer_code,
    },
  });
}
