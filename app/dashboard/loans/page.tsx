import { DataTable } from "@/components/ui/data-table";
import { SectionHeading } from "@/components/ui/section-heading";
import { StatusPill } from "@/components/ui/status-pill";
import { requireRole } from "@/lib/authz";
import { getMemberWorkspace } from "@/lib/member";

export default async function LoansPage() {
  const user = await requireRole(["ADMIN", "LIBRARIAN", "MEMBER"]);
  const workspace = getMemberWorkspace(user.email);

  return (
    <div className="space-y-6">
      <SectionHeading
        description="Loan rows show copy-level circulation, due dates, and returned status for the signed-in member."
        eyebrow="Circulation"
        title="My loans"
      />
      <DataTable
        columns={["Title", "Copy", "Borrowed", "Due", "Status", "Notes"]}
        rows={workspace.loans.map((loan) => [
          loan.book?.title ?? "Unknown title",
          loan.copyCode,
          new Date(loan.borrowedAt).toLocaleDateString("id-ID"),
          loan.dueLabel,
          <StatusPill key={loan.copyCode} status={loan.status} />,
          loan.notes,
        ])}
      />
    </div>
  );
}
