import Image from "next/image";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import type { EnrichedBook } from "@/lib/catalog";

export function BookCard({ book }: { book: EnrichedBook }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-sm">
      <div className="aspect-[4/5] bg-surface-muted">
        {book.coverUrl ? (
          <Image
            alt={`${book.title} cover`}
            className="h-full w-full object-cover"
            height={520}
            src={book.coverUrl}
            width={400}
          />
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex flex-wrap gap-2">
          {book.categories.slice(0, 2).map((category) =>
            category ? (
              <Badge key={category.slug} tone="primary">
                {category.name}
              </Badge>
            ) : null,
          )}
        </div>
        <h2 className="mt-3 text-base font-semibold leading-6 text-ink">{book.title}</h2>
        <p className="mt-1 text-sm text-ink-muted">
          {book.authors.map((author) => author?.name).filter(Boolean).join(", ")}
        </p>
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="font-medium text-success">{book.availability.available} available</span>
          <span className="flex items-center gap-1 text-ink-muted">
            <Star className="h-4 w-4 fill-accent text-accent" />
            {book.rating ? book.rating.toFixed(1) : "New"}
          </span>
        </div>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-ink-muted">{book.description}</p>
        <div className="mt-auto pt-4">
          <ButtonLink className="w-full" href={`/catalog/${book.slug}`} variant="secondary">
            View details
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}
