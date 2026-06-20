import { SectionHeading } from "@/components/ui/section-heading";
import { requireRole } from "@/lib/authz";

export default async function NewBookPage() {
  await requireRole(["ADMIN", "LIBRARIAN"]);

  return (
    <div className="space-y-6">
      <SectionHeading description="Staff can create catalog records with metadata, publication data, and shelf placement." eyebrow="Catalog" title="New book" />
      <form className="grid gap-4 rounded-lg border border-border bg-surface p-5 md:grid-cols-2">
        {["Title", "ISBN", "Publication year", "Language", "Shelf", "Cover URL"].map((label) => (
          <label className="text-sm font-medium text-ink" key={label}>
            {label}
            <input className="focus-ring mt-2 h-10 w-full rounded-md border border-border px-3 text-sm" />
          </label>
        ))}
        <label className="text-sm font-medium text-ink md:col-span-2">
          Description
          <textarea className="focus-ring mt-2 min-h-32 w-full rounded-md border border-border px-3 py-2 text-sm" />
        </label>
        <div className="md:col-span-2">
          <button className="focus-ring rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white" type="button">
            Save draft
          </button>
        </div>
      </form>
    </div>
  );
}
