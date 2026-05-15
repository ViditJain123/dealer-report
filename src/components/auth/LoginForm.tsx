"use client";

import { useActionState } from "react";
import Link from "next/link";

import { login } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { FormState } from "@/lib/auth/validation";

/**
 * Distributor log-in form. Submits to the `login` Server Action via
 * `useActionState`; on success the action redirects to the dashboard.
 */
export function LoginForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(
    login,
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

      <Field label="Password" htmlFor="password" error={state?.errors?.password}>
        <Input name="password" type="password" autoComplete="current-password" required />
      </Field>

      <Button type="submit" disabled={pending} className="mt-2 w-full">
        {pending ? "Logging in…" : "Log in"}
      </Button>

      <p className="text-center text-caption text-muted-foreground">
        Need an account?{" "}
        <Link
          href="/signup"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Sign up
        </Link>
      </p>
    </form>
  );
}
