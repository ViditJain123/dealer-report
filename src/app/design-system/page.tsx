import type { Metadata } from "next";
import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const metadata: Metadata = { title: "Design System · Dealer Report" };

/**
 * Living component gallery — the canonical reference for the reusable UI built
 * in `src/components/ui`. Every primitive is rendered here with its variants
 * and states, so it always reflects the real code. Add a new component? Add a
 * section here.
 */

const SWATCHES = [
  { name: "primary", box: "bg-primary", fg: "text-primary-foreground" },
  { name: "secondary", box: "bg-secondary", fg: "text-secondary-foreground" },
  { name: "muted", box: "bg-muted", fg: "text-muted-foreground" },
  { name: "accent", box: "bg-accent", fg: "text-accent-foreground" },
  { name: "destructive", box: "bg-destructive", fg: "text-destructive-foreground" },
  { name: "success", box: "bg-success", fg: "text-success-foreground" },
  { name: "warning", box: "bg-warning", fg: "text-warning-foreground" },
] as const;

const TYPE_SCALE = [
  { name: "display", className: "text-display" },
  { name: "title", className: "text-title" },
  { name: "heading", className: "text-heading" },
  { name: "subheading", className: "text-subheading" },
  { name: "body", className: "text-body" },
  { name: "label", className: "text-label" },
  { name: "caption", className: "text-caption" },
] as const;

const BUTTON_VARIANTS = [
  "default",
  "secondary",
  "outline",
  "ghost",
  "destructive",
  "link",
] as const;

const BADGE_VARIANTS = [
  "default",
  "secondary",
  "outline",
  "ghost",
  "destructive",
] as const;

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-heading font-semibold text-foreground">{title}</h2>
        <p className="text-body text-muted-foreground">{description}</p>
      </div>
      {children}
    </section>
  );
}

function Row({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap items-center gap-3">{children}</div>;
}

export default function DesignSystemPage() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-12 px-6 py-16">
      <header className="flex flex-col gap-1.5">
        <h1 className="text-display font-sans text-foreground">Design System</h1>
        <p className="text-body text-muted-foreground">
          The reusable component library for Dealer Report. Tokens come from{" "}
          <code className="rounded bg-muted px-1 py-0.5 font-mono text-caption">
            design-tokens/tokens.js
          </code>
          ; primitives live in{" "}
          <code className="rounded bg-muted px-1 py-0.5 font-mono text-caption">
            src/components/ui
          </code>
          .
        </p>
      </header>

      <Section title="Colors" description="Semantic color tokens (light theme).">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {SWATCHES.map(({ name, box, fg }) => (
            <div
              key={name}
              className={`flex h-20 flex-col justify-end rounded-lg border border-border p-2.5 ${box}`}
            >
              <span className={`text-label ${fg}`}>{name}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Typography" description="The semantic type scale.">
        <div className="flex flex-col gap-3">
          {TYPE_SCALE.map(({ name, className }) => (
            <div key={name} className="flex items-baseline gap-4">
              <span className="w-24 shrink-0 text-caption text-muted-foreground">
                {name}
              </span>
              <span className={`${className} text-foreground`}>
                The quick brown fox
              </span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Buttons" description="Variants, sizes, and states.">
        <div className="flex flex-col gap-4">
          <Row>
            {BUTTON_VARIANTS.map((variant) => (
              <Button key={variant} variant={variant}>
                {variant}
              </Button>
            ))}
          </Row>
          <Row>
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button disabled>Disabled</Button>
          </Row>
        </div>
      </Section>

      <Section title="Badges" description="Compact status labels.">
        <Row>
          {BADGE_VARIANTS.map((variant) => (
            <Badge key={variant} variant={variant}>
              {variant}
            </Badge>
          ))}
        </Row>
      </Section>

      <Section
        title="Form controls"
        description="Input, Label, and the Field wrapper (label + control + error)."
      >
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ds-bare">Bare Input + Label</Label>
            <Input id="ds-bare" placeholder="Placeholder text" />
          </div>
          <Field label="With hint" htmlFor="ds-hint" hint="Helper text shown below.">
            <Input placeholder="you@company.com" />
          </Field>
          <Field
            label="With error"
            htmlFor="ds-error"
            error={["Enter a valid email address."]}
          >
            <Input defaultValue="not-an-email" />
          </Field>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ds-disabled">Disabled</Label>
            <Input id="ds-disabled" placeholder="Disabled" disabled />
          </div>
        </div>
      </Section>

      <Section title="Card" description="Surface container for grouped content.">
        <Card>
          <CardHeader>
            <CardTitle>Card title</CardTitle>
            <CardDescription>A short supporting description.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-body text-muted-foreground">
              Card content sits here — forms, text, or any grouped UI.
            </p>
          </CardContent>
          <CardFooter>
            <Button size="sm">Action</Button>
          </CardFooter>
        </Card>
      </Section>

      <Section title="Table" description="Rows of structured data.">
        <div className="overflow-hidden rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium text-foreground">Acme Mobiles</TableCell>
                <TableCell>AC-001</TableCell>
                <TableCell>
                  <Badge variant="secondary">Active</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium text-foreground">Bharat Electronics</TableCell>
                <TableCell>BE-014</TableCell>
                <TableCell>
                  <Badge variant="secondary">Active</Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </Section>

      <Section title="Dialog" description="Modal overlay for focused tasks.">
        <Dialog>
          <DialogTrigger asChild>
            <Button>Open dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dialog title</DialogTitle>
              <DialogDescription>
                Dialogs trap focus and close on overlay click or Escape.
              </DialogDescription>
            </DialogHeader>
            <p className="text-body text-muted-foreground">
              Place a form or confirmation content here.
            </p>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button>Confirm</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Section>

      <Section title="Separator" description="A thin rule between content groups.">
        <div className="flex flex-col gap-3">
          <span className="text-body text-foreground">Above the separator</span>
          <Separator />
          <span className="text-body text-foreground">Below the separator</span>
        </div>
      </Section>
    </main>
  );
}
