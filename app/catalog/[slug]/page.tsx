import Image from "next/image";
import { notFound } from "next/navigation";
import { BookMarked, CalendarDays, Heart, Star } from "lucide-react";
import { PublicShell } from "@/components/layout/public-shell";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { MetricCard } from "@/components/ui/metric-card";
import { StatusPill } from "@/components/ui/status-pill";
import { getBookCopySummary, getCatalogBook } from "@/lib/catalog";
import { reviews } from "@/lib/seed-data";

type Params = Promise<{ slug: string }>;

export default async function CatalogDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const book = getCatalogBook(slug);
  if (!book) notFound();
  const copies = getBookCopySummary(slug);
  const bookReviews = reviews.filter((review) => review.bookSlug === slug);

  return (
    <PublicShell>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[340px_1fr]">
          <div>
            <div className="overflow-hidden rounded-lg border border-border bg-surface shadow-sm">
              {book.coverUrl ? (
                <Image
                  alt={`${book.title} cover`}
                  className="w-full object-cover"
                  height={520}
                  src={book.coverUrl}
                  width={380}
                />
              ) : null}
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <ButtonLink href="/dashboard/favorites" variant="secondary">
                <Heart className="h-4 w-4" />
                Add favorite
              </ButtonLink>
              <ButtonLink href="/dashboard/reservations">
                <BookMarked className="h-4 w-4" />
                Reserve title
              </ButtonLink>
            </div>
          </div>
          <section>
            <div className="flex flex-wrap gap-2">
              {book.categories.map((category) =>
                category ? (
                  <Badge key={category.slug} tone="primary">
                    {category.name}
                  </Badge>
                ) : null,
              )}
            </div>
            <h1 className="mt-4 text-3xl font-semibold text-ink md:text-4xl">{book.title}</h1>
            <p className="mt-2 text-base text-ink-muted">
              {book.authors.map((author) => author?.name).filter(Boolean).join(", ")}
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <MetricCard
                icon={<BookMarked className="h-5 w-5" />}
                label="Available copies"
                value={book.availability.available}
                hint={`${book.availability.total} total copies`}
                tone="success"
              />
              <MetricCard
                icon={<Star className="h-5 w-5" />}
                label="Average rating"
                value={book.rating ? book.rating.toFixed(1) : "New"}
                hint={`${book.reviewCount} member reviews`}
                tone="accent"
              />
              <MetricCard
                icon={<CalendarDays className="h-5 w-5" />}
                label="Published"
                value={book.publicationYear ?? "N/A"}
                hint={book.publisher?.name ?? "Publisher not set"}
              />
            </div>
            <div className="mt-8 rounded-lg border border-border bg-surface p-5">
              <h2 className="text-lg font-semibold text-ink">Description</h2>
              <p className="mt-3 text-sm leading-7 text-ink-muted">{book.description}</p>
              <dl className="mt-5 grid gap-4 sm:grid-cols-2">
                {[
                  ["ISBN", book.isbn ?? "N/A"],
                  ["Language", book.language],
                  ["Pages", book.pageCount?.toString() ?? "N/A"],
                  ["Edition", book.edition ?? "N/A"],
                  ["Shelf", book.locationShelf ?? "N/A"],
                  ["Publisher", book.publisher?.name ?? "N/A"],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-xs font-semibold uppercase text-ink-muted">{label}</dt>
                    <dd className="mt-1 text-sm font-medium text-ink">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="mt-6">
              <h2 className="mb-3 text-lg font-semibold text-ink">Copy summary</h2>
              <DataTable
                columns={["Copy", "Barcode", "Status", "Condition"]}
                rows={copies.map((copy) => [
                  copy.copyCode,
                  copy.barcode,
                  <StatusPill key={copy.copyCode} status={copy.status} />,
                  copy.conditionNote,
                ])}
              />
            </div>
            <div className="mt-6 rounded-lg border border-border bg-surface p-5">
              <h2 className="text-lg font-semibold text-ink">Member reviews</h2>
              <div className="mt-4 space-y-4">
                {bookReviews.length ? (
                  bookReviews.map((review) => (
                    <article className="border-b border-border pb-4 last:border-b-0 last:pb-0" key={review.title}>
                      <div className="flex items-center gap-2 text-sm text-accent">
                        <Star className="h-4 w-4 fill-accent" />
                        {review.rating}/5
                      </div>
                      <h3 className="mt-2 text-sm font-semibold text-ink">{review.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-ink-muted">{review.body}</p>
                    </article>
                  ))
                ) : (
                  <p className="text-sm text-ink-muted">No reviews yet.</p>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
    </PublicShell>
  );
}
