import { z } from "zod";

/**
 * Zod schemas for the auth and dealer forms, plus the shared `FormState` shape
 * returned by the Server Actions that back them.
 */

/** Trimmed + lowercased, then validated as an email address. */
const email = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email({ error: "Enter a valid email address." }));

/** Distributor sign-up — email + password only (Phase 1 scope). */
export const SignupSchema = z.object({
  email,
  password: z
    .string()
    .min(8, { error: "Password must be at least 8 characters." })
    .max(128, { error: "Password must be at most 128 characters." }),
});

/** Distributor log-in. */
export const LoginSchema = z.object({
  email,
  password: z.string().min(1, { error: "Enter your password." }),
});

/** Fields a distributor fills in to onboard a dealer. */
export const AddDealerSchema = z.object({
  dealerName: z
    .string()
    .trim()
    .min(1, { error: "Dealer name is required." })
    .max(120, { error: "Dealer name is too long." }),
  dealerCode: z
    .string()
    .trim()
    .min(1, { error: "Dealer code is required." })
    .max(32, { error: "Dealer code must be at most 32 characters." }),
  password: z
    .string()
    .min(6, { error: "Password must be at least 6 characters." })
    .max(128, { error: "Password must be at most 128 characters." }),
  phoneNumber: z
    .string()
    .trim()
    .regex(/^\+[1-9]\d{6,14}$/, {
      error: "Use international format, e.g. +919876543210.",
    }),
});

export type SignupInput = z.infer<typeof SignupSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type AddDealerInput = z.infer<typeof AddDealerSchema>;

/**
 * Return shape for the auth/dealer Server Actions, consumed via `useActionState`.
 * `undefined` is the initial state before the first submission.
 */
export type FormState =
  | {
      /** True after a successful mutation — e.g. used to close the dialog. */
      ok?: boolean;
      /** Top-level error message (e.g. "Invalid email or password."). */
      message?: string;
      /** Field-level validation errors, keyed by the form field name. */
      errors?: Record<string, string[] | undefined>;
    }
  | undefined;
