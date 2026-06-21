import { MetricCard } from "@/components/ui/metric-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { requireRole } from "@/lib/authz";
import { getAdminStats } from "@/lib/admin";
import { formatCurrency } from "@/lib/utils";

export default async function AdminReportsPage() {
  await requireRole(["ADMIN"]);
  const stats = getAdminStats();
  return (
    <div className="space-y-6">
      <SectionHeading description="Admin reporting consolidates catalog, circulation, fine, and audit summaries." eyebrow="Reports" title="Admin reports" />
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Books" value={stats.totalBooks} />
        <MetricCard label="Copies" value={stats.totalCopies} tone="success" />
        <MetricCard label="Unpaid fines" value={formatCurrency(stats.unpaidFines)} tone="danger" />
        <MetricCard label="Audit events" value={stats.auditEvents} tone="accent" />
      </div>
    </div>
  );
}
