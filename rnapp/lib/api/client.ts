import Constants from "expo-constants";

/**
 * Thin client for the Next.js dealer API.
 *
 * The base URL comes from `extra.apiBaseUrl` in app.json when set; otherwise it
 * is derived from the Metro dev-server host (the dev machine's LAN IP), so the
 * app reaches the backend on a real device in development with no config.
 */
function resolveBaseUrl(): string {
  const configured = Constants.expoConfig?.extra?.apiBaseUrl;
  if (typeof configured === "string" && configured.length > 0) {
    return configured;
  }
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    return `http://${hostUri.split(":")[0]}:3000`;
  }
  return "http://localhost:3000";
}

const BASE_URL = resolveBaseUrl();

export type DealerInfo = {
  id: string;
  dealerName: string;
  dealerCode: string;
  phoneNumber?: string;
};

export type LoginPayload = {
  phoneNumber: string;
  dealerCode: string;
  password: string;
  deviceId: string;
  deviceLabel: string;
};

export type LoginResult =
  | { ok: true; token: string; dealer: DealerInfo }
  | { ok: false; status?: "device_pending"; error: string };

/** POST /api/dealer/login */
export async function dealerLogin(payload: LoginPayload): Promise<LoginResult> {
  try {
    const res = await fetch(`${BASE_URL}/api/dealer/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (res.ok && data?.ok) {
      return { ok: true, token: data.token, dealer: data.dealer };
    }
    return {
      ok: false,
      status: data?.status,
      error: data?.error ?? "Could not sign in. Please try again.",
    };
  } catch {
    return {
      ok: false,
      error: "Cannot reach the server. Check your connection and try again.",
    };
  }
}

/** GET /api/dealer/me — resolves the dealer behind a session token, or null. */
export async function dealerMe(token: string): Promise<DealerInfo | null> {
  try {
    const res = await fetch(`${BASE_URL}/api/dealer/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    return res.ok && data?.ok ? data.dealer : null;
  } catch {
    return null;
  }
}

/** POST /api/dealer/logout — best-effort; the local token is cleared regardless. */
export async function dealerLogout(token: string): Promise<void> {
  try {
    await fetch(`${BASE_URL}/api/dealer/logout`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch {
    // Ignore — logout still clears the token on the device.
  }
}
