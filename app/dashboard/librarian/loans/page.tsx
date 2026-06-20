import { DataTable } from "@/components/ui/data-table";
import { SectionHeading } from "@/components/ui/section-heading";
import { StatusPill } from "@/components/ui/status-pill";
import { requireRole } from "@/lib/authz";
import { getLoanRows } from "@/lib/librarian";
import { issueLoanAction } from "../circulation-actions";

export default async function LibrarianLoansPage() {
  await requireRole(["ADMIN", "LIBRARIAN"]);
  const loans = getLoanRows();

  return (
    <div className="space-y-6">
      <SectionHeading description="Create copy-level loans after checking member status, limits, and unpaid fines." eyebrow="Circulation" title="Loan desk" />
      <section className="rounded-lg border border-border bg-surface p-5">
        <h2 className="text-lg font-semibold text-ink">Issue loan</h2>
        <form action={issueLoanAction} className="mt-4 grid gap-3 md:grid-cols-[1fr_1fr_auto]">
          <input className="focus-ring h-10 rounded-md border border-border px-3 text-sm" defaultValue="member@urlibrary.demo" name="memberEmail" />
          <input className="focus-ring h-10 rounded-md border border-border px-3 text-sm" defaultValue="URL-LP-001" name="copyCode" />
          <button className="focus-ring h-10 rounded-md bg-primary px-4 text-sm font-semibold text-white" type="submit">
            Issue
          </button>
        </form>
      </section>
      <DataTable
        columns={["Member", "Title", "Copy", "Borrowed", "Due", "Status"]}
        rows={loans.map((loan) => [
          loan.userEmail,
          loan.book?.title,
          loan.copyCode,
          loan.borrowedLabel,
          loan.dueLabel,
          <StatusPill key={loan.id} status={loan.status} />,
        ])}
      />
    </div>
  );
}
