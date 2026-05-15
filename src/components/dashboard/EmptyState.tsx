import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * EmptyState — a centered placeholder for a list/section with no content yet.
 * Reusable: supply an icon, a title, optional description, and an optional
 * action (e.g. a button) to guide the user to the first step.
 *
 * @example
 * <EmptyState
 *   icon={<Users className="size-8" />}
 *   title="No dealers yet"
 *   description="Add your first dealer to get started."
 *   action={<AddDealerDialog />}
 * />
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border px-6 py-16 text-center",
        className,
      )}
    >
      {icon ? <div className="text-muted-foreground">{icon}</div> : null}
      <div className="flex flex-col gap-1">
        <h3 className="text-subheading font-semibold text-foreground">{title}</h3>
        {description ? (
          <p className="max-w-sm text-body text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action ? <div className="mt-1">{action}</div> : null}
    </div>
  );
}
