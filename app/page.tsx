import Image from "next/image";
import { ArrowRight, BookCopy, Clock3, Library, Search, ShieldCheck } from "lucide-react";
import { PublicShell } from "@/components/layout/public-shell";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { MetricCard } from "@/components/ui/metric-card";

export default function HomePage() {
  return (
    <PublicShell>
      <main>
        <section className="border-b border-border bg-surface">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
            <div className="flex flex-col justify-center">
              <Badge tone="primary">UrLibrary Nexus</Badge>
              <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight text-ink md:text-5xl">
                Digital library operations for discovery, loans, reservations, and reports.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-ink-muted">
                A full-stack modernization of the original UrLibrary catalog into a realistic
                library management workspace for members, librarians, and admins.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href="/catalog">
                  Browse catalog
                  <ArrowRight className="h-4 w-4" />
                </ButtonLink>
                <ButtonLink href="/dashboard" variant="secondary">
                  Open workspace
                </ButtonLink>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-[0.9fr_1.1fr]">
              <div className="space-y-4">
                <MetricCard
                  icon={<Library className="h-5 w-5" />}
                  label="Catalog records"
                  value="25+"
                  hint="Seeded titles with authors, categories, tags, and copy inventory."
                />
                <MetricCard
                  icon={<Clock3 className="h-5 w-5" />}
                  label="Operational flows"
                  value="Loans"
                  hint="Borrowing, returns, due dates, holds, notifications, and fines."
                  tone="accent"
                />
              </div>
              <div className="rounded-lg border border-border bg-surface-muted p-4">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    {
                      title: "Atomic Habits",
                      src: "https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg",
                    },
                    {
                      title: "Clean Code",
                      src: "https://covers.openlibrary.org/b/isbn/9780132350884-L.jpg",
                    },
                    {
                      title: "Laskar Pelangi",
                      src: "https://covers.openlibrary.org/b/isbn/9789793062792-L.jpg",
                    },
                    {
                      title: "Sapiens",
                      src: "https://covers.openlibrary.org/b/isbn/9780062316097-L.jpg",
                    },
                  ].map((book) => (
                    <div className="overflow-hidden rounded-md bg-white shadow-sm" key={book.title}>
                      <Image
                        alt={`${book.title} cover`}
                        className="h-44 w-full object-cover"
                        height={320}
                        src={book.src}
                        width={220}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="mx-auto grid max-w-7xl gap-4 px-4 py-8 sm:px-6 md:grid-cols-3 lg:px-8">
          <MetricCard
            icon={<Search className="h-5 w-5" />}
            label="Public discovery"
            value="Server filters"
            hint="Search by title, author, or ISBN with category, tag, availability, and rating sort."
          />
          <MetricCard
            icon={<BookCopy className="h-5 w-5" />}
            label="Inventory aware"
            value="Copy-level"
            hint="Loans happen against BookCopy records so availability stays accurate."
            tone="success"
          />
          <MetricCard
            icon={<ShieldCheck className="h-5 w-5" />}
            label="Role based access"
            value="3 roles"
            hint="Member, librarian, and admin experiences are guarded on the server."
            tone="warning"
          />
        </section>
        <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
          <div className="grid gap-4 rounded-lg border border-border bg-surface p-5 md:grid-cols-4">
            {[
              "Advanced catalog",
              "Reservation queue",
              "Fine calculation",
              "Audit log",
              "XLSX export",
              "Developer page",
              "Prisma schema",
              "Deployment notes",
            ].map((item) => (
              <div className="rounded-md bg-surface-muted px-3 py-2 text-sm font-medium text-ink" key={item}>
                {item}
              </div>
            ))}
          </div>
        </section>
      </main>
    </PublicShell>
  );
}
