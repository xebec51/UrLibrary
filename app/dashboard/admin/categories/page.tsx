import { DataTable } from "@/components/ui/data-table";
import { SectionHeading } from "@/components/ui/section-heading";
import { requireRole } from "@/lib/authz";
import { categories, books } from "@/lib/seed-data";

export default async function AdminCategoriesPage() {
  await requireRole(["ADMIN"]);
  return (
    <div className="space-y-6">
      <SectionHeading description="Categories are used by public discovery and inventory reports." eyebrow="Catalog" title="Categories" />
      <DataTable columns={["Name", "Slug", "Description", "Books"]} rows={categories.map((category) => [category.name, category.slug, category.description, books.filter((book) => book.categorySlugs.includes(category.slug)).length])} />
    </div>
  );
}
