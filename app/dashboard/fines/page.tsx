import { WalletCards } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { MetricCard } from "@/components/ui/metric-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { StatusPill } from "@/components/ui/status-pill";
import { requireRole } from "@/lib/authz";
import { getMemberWorkspace } from "@/lib/member";
import { formatCurrency } from "@/lib/utils";

export default async function FinesPage() {
  const user = await requireRole(["ADMIN", "LIBRARIAN", "MEMBER"]);
  const workspace = getMemberWorkspace(user.email);
  const unpaid = workspace.fines.filter((fine) => fine.status === "UNPAID").reduce((total, fine) => total + fine.amount, 0);

  return (
    <div className="space-y-6">
      <SectionHeading
        description="Fine visibility is scoped to the signed-in member. Payment and waiver are handled by staff roles."
        eyebrow="Fines"
        title="My fines"
      />
      <MetricCard icon={<WalletCards className="h-5 w-5" />} label="Unpaid balance" value={formatCurrency(unpaid)} tone={unpaid ? "danger" : "success"} />
      <DataTable
        columns={["Reason", "Amount", "Status"]}
        rows={workspace.fines.map((fine) => [
          fine.reason,
          formatCurrency(fine.amount),
          <StatusPill key={fine.reason} status={fine.status} />,
        ])}
      />
    </div>
  );
}
