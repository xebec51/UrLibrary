import { DataTable } from "@/components/ui/data-table";
import { SectionHeading } from "@/components/ui/section-heading";
import { requireRole } from "@/lib/authz";
import { getCatalogBooks } from "@/lib/catalog";

export default async function AdminCatalogPage() {
  await requireRole(["ADMIN"]);
  const catalog = getCatalogBooks({ pageSize: 25, sort: "title" });

  return (
    <div className="space-y-6">
      <SectionHeading description="Admin-level catalog management covers publication state and metadata quality." eyebrow="Catalog" title="Catalog administration" />
      <DataTable
        columns={["Title", "ISBN", "Publisher", "Copies", "Published"]}
        rows={catalog.items.map((book) => [
          book.title,
          book.isbn ?? "N/A",
          book.publisher?.name ?? "N/A",
          book.availability.total,
          book.isPublished ? "Yes" : "No",
        ])}
      />
    </div>
  );
}
