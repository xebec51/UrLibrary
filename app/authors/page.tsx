import Link from "next/link";
import { PublicShell } from "@/components/layout/public-shell";
import { SectionHeading } from "@/components/ui/section-heading";
import { authors, books } from "@/lib/seed-data";

export default function AuthorsPage() {
  return (
    <PublicShell>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <SectionHeading
          description="Browse author records connected to catalog titles, including Indonesian and international works."
          eyebrow="Authors"
          title="Author directory"
        />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {authors.map((author) => {
            const count = books.filter((book) => book.authorSlugs.includes(author.slug)).length;
            return (
              <Link
                className="focus-ring rounded-lg border border-border bg-surface p-5 shadow-sm hover:border-primary"
                href={`/authors/${author.slug}`}
                key={author.slug}
              >
                <h2 className="text-base font-semibold text-ink">{author.name}</h2>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-ink-muted">{author.bio}</p>
                <p className="mt-4 text-sm font-medium text-primary">{count} catalog titles</p>
              </Link>
            );
          })}
        </div>
      </main>
    </PublicShell>
  );
}
