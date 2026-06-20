import Link from "next/link";
import { Plus } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { SectionHeading } from "@/components/ui/section-heading";
import { requireRole } from "@/lib/authz";
import { getCatalogBooks } from "@/lib/catalog";

export default async function LibrarianBooksPage() {
  await requireRole(["ADMIN", "LIBRARIAN"]);
  const catalog = getCatalogBooks({ pageSize: 25 });

  return (
    <div className="space-y-6">
      <SectionHeading
        action={<ButtonLink href="/dashboard/librarian/books/new"><Plus className="h-4 w-4" />New book</ButtonLink>}
        description="Catalog management for staff operations."
        eyebrow="Catalog"
        title="Books"
      />
      <DataTable
        columns={["Title", "Authors", "Copies", "Available", "Rating", "Open"]}
        rows={catalog.items.map((book) => [
          book.title,
          book.authors.map((author) => author?.name).filter(Boolean).join(", "),
          book.availability.total,
          book.availability.available,
          book.rating ? book.rating.toFixed(1) : "New",
          <Link className="font-semibold text-primary" href={`/dashboard/librarian/books/${book.slug}`} key={book.slug}>
            Edit
          </Link>,
        ])}
      />
    </div>
  );
}
