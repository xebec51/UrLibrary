import { notFound } from "next/navigation";
import { BookCard } from "@/components/catalog/book-card";
import { PublicShell } from "@/components/layout/public-shell";
import { SectionHeading } from "@/components/ui/section-heading";
import { getAuthor } from "@/lib/catalog";

type Params = Promise<{ slug: string }>;

export default async function AuthorDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const author = getAuthor(slug);
  if (!author) notFound();

  return (
    <PublicShell>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <SectionHeading description={author.bio} eyebrow="Author" title={author.name} />
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {author.books.map((book) => (
            <BookCard book={book} key={book.slug} />
          ))}
        </div>
      </main>
    </PublicShell>
  );
}
