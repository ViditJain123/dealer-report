import * as React from "react"

import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

/**
 * Field — pairs a {@link Label} with a single form control, plus an optional
 * hint and a validation error message. Built for `useActionState`-driven forms:
 * pass the `error` array straight from a Zod `fieldErrors` entry.
 *
 * The child control is cloned to receive `id` (matching `htmlFor`), and the
 * `aria-invalid` / `aria-describedby` attributes, so callers only need `name`.
 *
 * @example
 * <Field label="Email" htmlFor="email" error={state?.errors?.email}>
 *   <Input name="email" type="email" />
 * </Field>
 */
function Field({
  label,
  htmlFor,
  error,
  hint,
  className,
  children,
}: {
  /** Visible label text. */
  label: string
  /** `id` applied to the control and target of the label's `htmlFor`. */
  htmlFor: string
  /** Validation messages; the first is shown. Pass a Zod `fieldErrors` entry. */
  error?: string[]
  /** Helper text shown below the control while there is no error. */
  hint?: string
  className?: string
  /** Exactly one form control (e.g. `<Input />`). */
  children: React.ReactElement
}) {
  const message = error?.[0]
  const errorId = `${htmlFor}-error`
  const hintId = `${htmlFor}-hint`
  const describedBy = message ? errorId : hint ? hintId : undefined

  const control = React.cloneElement(
    children as React.ReactElement<{
      id?: string
      "aria-invalid"?: boolean
      "aria-describedby"?: string
    }>,
    {
      id: htmlFor,
      "aria-invalid": message ? true : undefined,
      "aria-describedby": describedBy,
    },
  )

  return (
    <div data-slot="field" className={cn("flex flex-col gap-1.5", className)}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {control}
      {hint && !message ? (
        <p id={hintId} className="text-caption text-muted-foreground">
          {hint}
        </p>
      ) : null}
      {message ? (
        <p id={errorId} className="text-caption text-destructive">
          {message}
        </p>
      ) : null}
    </div>
  )
}

export { Field }
