"use client";

import { useActionState } from "react";
import Link from "next/link";

import { signup } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { FormState } from "@/lib/auth/validation";

/**
 * Distributor sign-up form. Submits to the `signup` Server Action via
 * `useActionState`; on success the action redirects to the dashboard.
 */
export function SignupForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(
    signup,
    undefined,
  );

  return (
    <form action={action} className="flex flex-col gap-4" noValidate>
      {state?.message ? (
        <p
          role="alert"
          className="rounded-md bg-destructive/10 px-3 py-2 text-caption text-destructive"
        >
          {state.message}
        </p>
      ) : null}

      <Field label="Email" htmlFor="email" error={state?.errors?.email}>
        <Input
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          required
        />
      </Field>

      <Field
        label="Password"
        htmlFor="password"
        error={state?.errors?.password}
        hint="At least 8 characters."
      >
        <Input name="password" type="password" autoComplete="new-password" required />
      </Field>

      <Button type="submit" disabled={pending} className="mt-2 w-full">
        {pending ? "Creating account…" : "Create account"}
      </Button>

      <p className="text-center text-caption text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Log in
        </Link>
      </p>
    </form>
  );
}
