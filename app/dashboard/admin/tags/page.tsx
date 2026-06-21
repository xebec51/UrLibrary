import { DataTable } from "@/components/ui/data-table";
import { SectionHeading } from "@/components/ui/section-heading";
import { requireRole } from "@/lib/authz";
import { tags, books } from "@/lib/seed-data";

export default async function AdminTagsPage() {
  await requireRole(["ADMIN"]);
  return (
    <div className="space-y-6">
      <SectionHeading description="Tags provide lightweight cross-cutting catalog labels." eyebrow="Catalog" title="Tags" />
      <DataTable columns={["Name", "Slug", "Books"]} rows={tags.map((tag) => [tag.name, tag.slug, books.filter((book) => book.tagSlugs.includes(tag.slug)).length])} />
    </div>
  );
}
