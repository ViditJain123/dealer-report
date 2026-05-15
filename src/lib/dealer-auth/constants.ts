/**
 * Dealer-auth constants.
 */

/** Dealer app session lifetime — long, since a mobile app stays signed in. */
export const DEALER_SESSION_TTL_MS = 90 * 24 * 60 * 60 * 1000; // 90 days

/**
 * A syntactically valid scrypt hash (`saltHex$hashHex`) that never matches a
 * real password. Verified against when the phone number is unknown, so login
 * timing does not reveal whether a dealer exists.
 */
export const DUMMY_PASSWORD_HASH = `${"0".repeat(32)}$${"0".repeat(128)}`;
