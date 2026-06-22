import { MetricCard } from "@/components/ui/metric-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { DataTable } from "@/components/ui/data-table";
import { ButtonLink } from "@/components/ui/button";
import { CirculationChart } from "@/components/reports/circulation-chart";
import { requireRole } from "@/lib/authz";
import { getAdminStats } from "@/lib/admin";
import { getCirculationChartData, getTopBooks } from "@/lib/reports";
import { formatCurrency } from "@/lib/utils";

export default async function AdminReportsPage() {
  await requireRole(["ADMIN"]);
  const stats = getAdminStats();
  const chart = getCirculationChartData();
  const topBooks = getTopBooks();
  return (
    <div className="space-y-6">
      <SectionHeading
        action={<ButtonLink href="/api/reports/export" variant="secondary">Export XLSX</ButtonLink>}
        description="Admin reporting consolidates catalog, circulation, fine, and audit summaries."
        eyebrow="Reports"
        title="Admin reports"
      />
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Books" value={stats.totalBooks} />
        <MetricCard label="Copies" value={stats.totalCopies} tone="success" />
        <MetricCard label="Unpaid fines" value={formatCurrency(stats.unpaidFines)} tone="danger" />
        <MetricCard label="Audit events" value={stats.auditEvents} tone="accent" />
      </div>
      <CirculationChart data={chart} />
      <DataTable
        columns={["Title", "Favorites", "Reviews"]}
        rows={topBooks.map((book) => [book.title, book.favorites, book.reviews])}
      />
    </div>
  );
}
