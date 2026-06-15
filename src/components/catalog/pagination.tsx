import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination({
  page,
  pageCount,
  searchParams,
}: {
  page: number;
  pageCount: number;
  searchParams: URLSearchParams;
}) {
  function hrefFor(targetPage: number) {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(targetPage));
    return `/catalog?${params.toString()}`;
  }

  return (
    <nav aria-label="Catalog pages" className="flex items-center justify-between gap-3">
      <Link
        aria-disabled={page <= 1}
        className="focus-ring inline-flex h-10 items-center gap-2 rounded-md border border-border bg-surface px-3 text-sm font-semibold text-ink aria-disabled:pointer-events-none aria-disabled:opacity-50"
        href={hrefFor(Math.max(1, page - 1))}
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Link>
      <p className="text-sm text-ink-muted">
        Page {page} of {pageCount}
      </p>
      <Link
        aria-disabled={page >= pageCount}
        className="focus-ring inline-flex h-10 items-center gap-2 rounded-md border border-border bg-surface px-3 text-sm font-semibold text-ink aria-disabled:pointer-events-none aria-disabled:opacity-50"
        href={hrefFor(Math.min(pageCount, page + 1))}
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </Link>
    </nav>
  );
}
