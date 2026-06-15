import { BookOpen } from "lucide-react";
import { BookCard } from "@/components/catalog/book-card";
import { CatalogFilter } from "@/components/catalog/catalog-filter";
import { Pagination } from "@/components/catalog/pagination";
import { PublicShell } from "@/components/layout/public-shell";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeading } from "@/components/ui/section-heading";
import { getCatalogBooks, type CatalogQuery } from "@/lib/catalog";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function valueOf(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function CatalogPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const query: CatalogQuery = {
    q: valueOf(params.q),
    category: valueOf(params.category),
    tag: valueOf(params.tag),
    availability: valueOf(params.availability) as CatalogQuery["availability"],
    sort: (valueOf(params.sort) as CatalogQuery["sort"]) ?? "newest",
    page: Number(valueOf(params.page) ?? 1),
    pageSize: 9,
  };
  const result = getCatalogBooks(query);
  const urlParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    const normalized = valueOf(value);
    if (normalized) urlParams.set(key, normalized);
  });

  return (
    <PublicShell>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <SectionHeading
          description="Search and filter catalog records with copy-level availability, ratings, categories, tags, and server-shaped pagination."
          eyebrow="Public catalog"
          title="Find books across the UrLibrary Nexus collection"
        />
        <div className="mt-6">
          <CatalogFilter
            availability={query.availability}
            category={query.category}
            q={query.q}
            sort={query.sort}
            tag={query.tag}
          />
        </div>
        <div className="mt-5 flex items-center justify-between">
          <p className="text-sm text-ink-muted">{result.total} books found</p>
          <ButtonLink href="/authors" size="sm" variant="secondary">
            Authors
          </ButtonLink>
        </div>
        {result.items.length ? (
          <>
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {result.items.map((book) => (
                <BookCard book={book} key={book.slug} />
              ))}
            </div>
            <div className="mt-8">
              <Pagination page={result.page} pageCount={result.pageCount} searchParams={urlParams} />
            </div>
          </>
        ) : (
          <div className="mt-6">
            <EmptyState
              action={<ButtonLink href="/catalog">Reset filters</ButtonLink>}
              description="No books match the current filters. Try a broader query or remove one of the filters."
              icon={<BookOpen className="h-8 w-8" />}
              title="No catalog records found"
            />
          </div>
        )}
      </main>
    </PublicShell>
  );
}
