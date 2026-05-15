"use client";

import { useActionState, useState } from "react";
import { Plus } from "lucide-react";

import { addDealer } from "@/app/actions/dealers";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { FormState } from "@/lib/auth/validation";

/**
 * "Add dealer" button + dialog. The dialog owns its open state; the form lives
 * in a child component so that closing the dialog unmounts it — every reopen
 * gets a clean form with no leftover input or validation state.
 */
export function AddDealerDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4" />
          Add dealer
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add dealer</DialogTitle>
          <DialogDescription>
            The dealer signs in to the mobile app with this code and password.
          </DialogDescription>
        </DialogHeader>
        <AddDealerForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

/**
 * Dealer-onboarding form. `onSuccess` fires from the action itself once
 * `addDealer` reports success — no effect needed to close the dialog.
 */
function AddDealerForm({ onSuccess }: { onSuccess: () => void }) {
  const [state, action, pending] = useActionState<FormState, FormData>(
    async (prevState, formData) => {
      const result = await addDealer(prevState, formData);
      if (result?.ok) {
        onSuccess();
      }
      return result;
    },
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

      <Field label="Dealer name" htmlFor="dealerName" error={state?.errors?.dealerName}>
        <Input name="dealerName" autoComplete="off" required />
      </Field>

      <Field
        label="Dealer code"
        htmlFor="dealerCode"
        error={state?.errors?.dealerCode}
        hint="Unique within your account."
      >
        <Input name="dealerCode" autoComplete="off" required />
      </Field>

      <Field
        label="Password"
        htmlFor="password"
        error={state?.errors?.password}
        hint="At least 6 characters. Shown so you can share it with the dealer."
      >
        <Input name="password" type="text" autoComplete="off" required />
      </Field>

      <Field
        label="Phone number"
        htmlFor="phoneNumber"
        error={state?.errors?.phoneNumber}
        hint="International format, e.g. +919876543210."
      >
        <Input
          name="phoneNumber"
          type="tel"
          inputMode="tel"
          autoComplete="off"
          placeholder="+919876543210"
          required
        />
      </Field>

      <DialogFooter className="mt-2">
        <DialogClose asChild>
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </DialogClose>
        <Button type="submit" disabled={pending}>
          {pending ? "Adding…" : "Add dealer"}
        </Button>
      </DialogFooter>
    </form>
  );
}
