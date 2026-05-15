import "server-only";

import { createHash, randomBytes } from "node:crypto";

/**
 * Opaque session-token helpers, shared by distributor web sessions and dealer
 * app sessions.
 *
 * The raw token is a 256-bit random hex string handed to the client; only its
 * SHA-256 hash is ever stored, so a leaked database row cannot be replayed.
 */

/** Generates a 256-bit random session token (hex-encoded). */
export function generateSessionToken(): string {
  return randomBytes(32).toString("hex");
}

/** SHA-256 hash of a token — what gets stored in / looked up from the DB. */
export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}
