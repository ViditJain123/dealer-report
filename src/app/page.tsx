export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-background p-8">
      <div className="flex flex-col items-center gap-1.5">
        <h1 className="text-display font-sans text-foreground">Dealer Report</h1>
        <p className="text-body text-muted-foreground">
          Design system foundations are ready.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <span className="rounded-md bg-primary px-4 py-2 text-label text-primary-foreground shadow-sm">
          Primary
        </span>
        <span className="rounded-md border border-border bg-card px-4 py-2 text-label text-card-foreground">
          Card
        </span>
        <span className="rounded-md bg-secondary px-4 py-2 text-label text-secondary-foreground">
          Secondary
        </span>
        <span className="rounded-md bg-destructive px-4 py-2 text-label text-destructive-foreground">
          Destructive
        </span>
      </div>
    </main>
  );
}
