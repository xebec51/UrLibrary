import { PublicShell } from "@/components/layout/public-shell";

export default function CatalogLoading() {
  return (
    <PublicShell>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="h-24 animate-pulse rounded-lg bg-surface-muted" />
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div className="h-96 animate-pulse rounded-lg bg-surface-muted" key={index} />
          ))}
        </div>
      </main>
    </PublicShell>
  );
}
