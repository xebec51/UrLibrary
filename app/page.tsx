import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background px-6 py-10">
      <section className="mx-auto flex max-w-6xl flex-col gap-8">
        <div className="rounded-lg border border-border bg-surface p-8 shadow-soft">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            UrLibrary Nexus
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold text-ink md:text-5xl">
            Digital library operations for discovery, lending, reservations, and reporting.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-ink-muted">
            The original UrLibrary catalog is being modernized into a portfolio-ready
            full-stack platform with secure role-based workflows.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/catalog"
              className="focus-ring rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white"
            >
              Open catalog
            </Link>
            <Link
              href="/login"
              className="focus-ring rounded-md border border-border bg-white px-4 py-2 text-sm font-semibold text-ink"
            >
              Staff sign in
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
