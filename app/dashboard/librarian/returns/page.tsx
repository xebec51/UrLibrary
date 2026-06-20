import { DataTable } from "@/components/ui/data-table";
import { SectionHeading } from "@/components/ui/section-heading";
import { StatusPill } from "@/components/ui/status-pill";
import { requireRole } from "@/lib/authz";
import { getLoanRows } from "@/lib/librarian";
import { returnLoanAction } from "../circulation-actions";

export default async function ReturnsPage() {
  await requireRole(["ADMIN", "LIBRARIAN"]);
  const activeLoans = getLoanRows().filter((loan) => loan.status === "ACTIVE" || loan.status === "OVERDUE");

  return (
    <div className="space-y-6">
      <SectionHeading description="Process returns, calculate overdue fines, and promote pending holds when copies become available." eyebrow="Returns" title="Return desk" />
      <DataTable
        columns={["Member", "Title", "Copy", "Due", "Status", "Action"]}
        rows={activeLoans.map((loan) => [
          loan.userEmail,
          loan.book?.title,
          loan.copyCode,
          loan.dueLabel,
          <StatusPill key={loan.id} status={loan.status} />,
          <form action={returnLoanAction} key={loan.id}>
            <input name="loanId" type="hidden" value={loan.id} />
            <button className="text-sm font-semibold text-primary" type="submit">
              Return
            </button>
          </form>,
        ])}
      />
    </div>
  );
}
