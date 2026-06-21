import { DataTable } from "@/components/ui/data-table";
import { SectionHeading } from "@/components/ui/section-heading";
import { requireRole } from "@/lib/authz";
import { publishers, books } from "@/lib/seed-data";

export default async function AdminPublishersPage() {
  await requireRole(["ADMIN"]);
  return (
    <div className="space-y-6">
      <SectionHeading description="Publisher records support metadata completeness and reports." eyebrow="Catalog" title="Publishers" />
      <DataTable columns={["Name", "Slug", "Website", "Books"]} rows={publishers.map((publisher) => [publisher.name, publisher.slug, publisher.website, books.filter((book) => book.publisherSlug === publisher.slug).length])} />
    </div>
  );
}
