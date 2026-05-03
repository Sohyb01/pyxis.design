const clientNames = ["Northstar", "Lumen", "Atlas", "Mint", "Orbit", "Forge"];

export function ClientsSection() {
  return (
    <section className="w-full">
      <div className="container mx-auto w-full px-4 py-16 text-center">
        <h2 className="text-lg font-semibold">
          Trusted by founders and growing product teams.
        </h2>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {clientNames.map((client) => (
            <div
              key={client}
              className="rounded-full border border-border bg-card px-4 py-2 text-xs font-medium text-muted-foreground"
            >
              {client}
            </div>
          ))}
          <div className="rounded-full bg-foreground px-4 py-2 text-xs font-medium text-background">
            30+ more
          </div>
        </div>
      </div>
    </section>
  );
}
