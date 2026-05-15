/**
 * Auth constants with no server-only dependencies.
 *
 * Kept dependency-free so `src/proxy.ts` can import the cookie name without
 * pulling in the `server-only`-guarded session/database modules.
 */

/** Name of the HttpOnly cookie that carries the distributor session token. */
export const SESSION_COOKIE = "dr_session";

/** Distributor web session lifetime. */
export const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
