import Link from "next/link";
import { PublicShell } from "@/components/layout/public-shell";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/section-heading";
import { categories, books, tags } from "@/lib/seed-data";

export default function CategoriesPage() {
  return (
    <PublicShell>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <SectionHeading
          description="Explore catalog groupings and tags used for public filtering and staff reporting."
          eyebrow="Categories"
          title="Collection taxonomy"
        />
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {categories.map((category) => {
            const count = books.filter((book) => book.categorySlugs.includes(category.slug)).length;
            return (
              <Link
                className="focus-ring rounded-lg border border-border bg-surface p-5 shadow-sm hover:border-primary"
                href={`/catalog?category=${category.slug}`}
                key={category.slug}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-base font-semibold text-ink">{category.name}</h2>
                    <p className="mt-2 text-sm leading-6 text-ink-muted">{category.description}</p>
                  </div>
                  <Badge tone="primary">{count}</Badge>
                </div>
              </Link>
            );
          })}
        </div>
        <section className="mt-8 rounded-lg border border-border bg-surface p-5">
          <h2 className="text-lg font-semibold text-ink">Tags</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Link href={`/catalog?tag=${tag.slug}`} key={tag.slug}>
                <Badge>{tag.name}</Badge>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </PublicShell>
  );
}
