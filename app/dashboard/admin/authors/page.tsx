import { DataTable } from "@/components/ui/data-table";
import { SectionHeading } from "@/components/ui/section-heading";
import { requireRole } from "@/lib/authz";
import { authors, books } from "@/lib/seed-data";

export default async function AdminAuthorsPage() {
  await requireRole(["ADMIN"]);
  return (
    <div className="space-y-6">
      <SectionHeading description="Author authority records normalize catalog search and filtering." eyebrow="Catalog" title="Authors" />
      <DataTable columns={["Name", "Slug", "Books"]} rows={authors.map((author) => [author.name, author.slug, books.filter((book) => book.authorSlugs.includes(author.slug)).length])} />
    </div>
  );
}
