"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { getSupabaseClient } from "@/lib/supabase/server";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { createSession, deleteSession } from "@/lib/auth/session";
import { LoginSchema, SignupSchema, type FormState } from "@/lib/auth/validation";

/**
 * Server Actions for distributor authentication: sign-up, log-in, log-out.
 *
 * `signup` and `login` are written for React's `useActionState`
 * `(prevState, formData)` signature; `logout` is a plain form action.
 */

// A syntactically valid hash that never matches a real password. Verifying
// against it on an unknown email keeps login timing uniform (no user-exists oracle).
const DUMMY_PASSWORD_HASH = `${"0".repeat(32)}$${"0".repeat(128)}`;

/** Creates a distributor account, starts a session, and enters the dashboard. */
export async function signup(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = SignupSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { errors: z.flattenError(parsed.error).fieldErrors };
  }

  const supabase = getSupabaseClient();
  const passwordHash = await hashPassword(parsed.data.password);

  const { data, error } = await supabase
    .from("distributors")
    .insert({ email: parsed.data.email, password_hash: passwordHash })
    .select("id")
    .single();

  if (error || !data) {
    if (error?.code === "23505") {
      return { errors: { email: ["An account with this email already exists."] } };
    }
    return { message: "Could not create your account. Please try again." };
  }

  await createSession(data.id);
  redirect("/dashboard");
}

/** Verifies distributor credentials, starts a session, and enters the dashboard. */
export async function login(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { errors: z.flattenError(parsed.error).fieldErrors };
  }

  const supabase = getSupabaseClient();
  const { data: distributor } = await supabase
    .from("distributors")
    .select("id, password_hash")
    .eq("email", parsed.data.email)
    .maybeSingle();

  const passwordOk = await verifyPassword(
    parsed.data.password,
    distributor?.password_hash ?? DUMMY_PASSWORD_HASH,
  );

  if (!distributor || !passwordOk) {
    return { message: "Invalid email or password." };
  }

  await createSession(distributor.id);
  redirect("/dashboard");
}

/** Ends the current session and returns to the login page. */
export async function logout(): Promise<void> {
  await deleteSession();
  redirect("/login");
}
