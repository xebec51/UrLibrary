import { DataTable } from "@/components/ui/data-table";
import { SectionHeading } from "@/components/ui/section-heading";
import { StatusPill } from "@/components/ui/status-pill";
import { requireRole } from "@/lib/authz";
import { getCopyRows } from "@/lib/librarian";

export default async function CopiesPage() {
  await requireRole(["ADMIN", "LIBRARIAN"]);
  const copies = getCopyRows();

  return (
    <div className="space-y-6">
      <SectionHeading description="Copy inventory tracks barcodes, availability, maintenance, and lost status." eyebrow="Inventory" title="Book copies" />
      <DataTable
        columns={["Title", "Copy", "Barcode", "Status", "Condition"]}
        rows={copies.map((copy) => [
          copy.book?.title,
          copy.copyCode,
          copy.barcode,
          <StatusPill key={copy.copyCode} status={copy.status} />,
          copy.conditionNote,
        ])}
      />
    </div>
  );
}
