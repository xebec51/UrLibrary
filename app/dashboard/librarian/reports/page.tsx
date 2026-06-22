import { MetricCard } from "@/components/ui/metric-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { DataTable } from "@/components/ui/data-table";
import { ButtonLink } from "@/components/ui/button";
import { CirculationChart } from "@/components/reports/circulation-chart";
import { getLibrarianStats } from "@/lib/librarian";
import { getCirculationChartData, getTopBooks } from "@/lib/reports";
import { requireRole } from "@/lib/authz";

export default async function LibrarianReportsPage() {
  await requireRole(["ADMIN", "LIBRARIAN"]);
  const stats = getLibrarianStats();
  const topBooks = getTopBooks();

  return (
    <div className="space-y-6">
      <SectionHeading
        action={<ButtonLink href="/api/reports/export" variant="secondary">Export XLSX</ButtonLink>}
        description="Operational reporting snapshot for staff decision-making."
        eyebrow="Reports"
        title="Librarian reports"
      />
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Active loans" value={stats.activeLoans} />
        <MetricCard label="Overdue loans" value={stats.overdueLoans} tone="danger" />
        <MetricCard label="Pending reservations" value={stats.pendingReservations} tone="warning" />
        <MetricCard label="Available copies" value={stats.availableCopies} tone="success" />
      </div>
      <CirculationChart data={getCirculationChartData()} />
      <DataTable columns={["Title", "Favorites", "Reviews"]} rows={topBooks.map((book) => [book.title, book.favorites, book.reviews])} />
    </div>
  );
}
