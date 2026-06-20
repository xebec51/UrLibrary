import { MetricCard } from "@/components/ui/metric-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { getLibrarianStats } from "@/lib/librarian";
import { requireRole } from "@/lib/authz";

export default async function LibrarianReportsPage() {
  await requireRole(["ADMIN", "LIBRARIAN"]);
  const stats = getLibrarianStats();

  return (
    <div className="space-y-6">
      <SectionHeading description="Operational reporting snapshot for staff decision-making." eyebrow="Reports" title="Librarian reports" />
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Active loans" value={stats.activeLoans} />
        <MetricCard label="Overdue loans" value={stats.overdueLoans} tone="danger" />
        <MetricCard label="Pending reservations" value={stats.pendingReservations} tone="warning" />
        <MetricCard label="Available copies" value={stats.availableCopies} tone="success" />
      </div>
    </div>
  );
}
