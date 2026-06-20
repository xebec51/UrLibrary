import { notFound } from "next/navigation";
import { DataTable } from "@/components/ui/data-table";
import { SectionHeading } from "@/components/ui/section-heading";
import { StatusPill } from "@/components/ui/status-pill";
import { requireRole } from "@/lib/authz";
import { getBookCopySummary, getCatalogBook } from "@/lib/catalog";

type Params = Promise<{ id: string }>;

export default async function LibrarianBookDetailPage({ params }: { params: Params }) {
  await requireRole(["ADMIN", "LIBRARIAN"]);
  const { id } = await params;
  const book = getCatalogBook(id);
  if (!book) notFound();
  const copies = getBookCopySummary(id);

  return (
    <div className="space-y-6">
      <SectionHeading description={book.description} eyebrow="Catalog record" title={book.title} />
      <section className="rounded-lg border border-border bg-surface p-5">
        <dl className="grid gap-4 md:grid-cols-3">
          {[
            ["ISBN", book.isbn ?? "N/A"],
            ["Publisher", book.publisher?.name ?? "N/A"],
            ["Shelf", book.locationShelf ?? "N/A"],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs font-semibold uppercase text-ink-muted">{label}</dt>
              <dd className="mt-1 text-sm font-semibold text-ink">{value}</dd>
            </div>
          ))}
        </dl>
      </section>
      <DataTable
        columns={["Copy", "Barcode", "Status", "Condition"]}
        rows={copies.map((copy) => [
          copy.copyCode,
          copy.barcode,
          <StatusPill key={copy.copyCode} status={copy.status} />,
          copy.conditionNote,
        ])}
      />
    </div>
  );
}
