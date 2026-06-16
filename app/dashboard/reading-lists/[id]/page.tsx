import { notFound } from "next/navigation";
import { BookCard } from "@/components/catalog/book-card";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/section-heading";
import { requireRole } from "@/lib/authz";
import { getMemberWorkspace } from "@/lib/member";

type Params = Promise<{ id: string }>;

export default async function ReadingListDetailPage({ params }: { params: Params }) {
  const user = await requireRole(["ADMIN", "LIBRARIAN", "MEMBER"]);
  const { id } = await params;
  const workspace = getMemberWorkspace(user.email);
  const list = workspace.readingLists.find((item) => item.id === id);
  if (!list) notFound();

  return (
    <div className="space-y-6">
      <SectionHeading description={list.description} eyebrow="Reading list" title={list.title} action={<Badge>{list.books.length} books</Badge>} />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.books.map((book) => (
          <div className="space-y-3" key={book.slug}>
            <BookCard book={book} />
            <p className="rounded-md bg-surface-muted px-3 py-2 text-sm text-ink-muted">{book.notes}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
