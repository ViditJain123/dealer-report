import "server-only";

import { randomBytes, scrypt, timingSafeEqual, type BinaryLike } from "node:crypto";

/**
 * Password hashing with Node's built-in scrypt — no external dependency.
 *
 * Stored format is `"<saltHex>$<hashHex>"`. scrypt is run with Node's default
 * cost parameters (N=16384, r=8, p=1), which are memory-hard and adequate for
 * password storage.
 */

const KEY_LENGTH = 64;

function deriveKey(password: BinaryLike, salt: BinaryLike): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, KEY_LENGTH, (err, derivedKey) => {
      if (err) reject(err);
      else resolve(derivedKey);
    });
  });
}

/** Hashes a plaintext password with a fresh random salt. */
export async function hashPassword(plain: string): Promise<string> {
  const salt = randomBytes(16);
  const derived = await deriveKey(plain, salt);
  return `${salt.toString("hex")}$${derived.toString("hex")}`;
}

/**
 * Verifies a plaintext password against a stored `"<saltHex>$<hashHex>"` value.
 * Returns false for malformed input; the comparison is timing-safe.
 */
export async function verifyPassword(plain: string, stored: string): Promise<boolean> {
  const [saltHex, hashHex] = stored.split("$");
  if (!saltHex || !hashHex) {
    return false;
  }

  const salt = Buffer.from(saltHex, "hex");
  const expected = Buffer.from(hashHex, "hex");
  if (expected.length !== KEY_LENGTH) {
    return false;
  }

  const derived = await deriveKey(plain, salt);
  return timingSafeEqual(derived, expected);
}
