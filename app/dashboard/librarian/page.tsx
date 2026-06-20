import { BookCopy, ClipboardList, Clock3, Library, Users } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { MetricCard } from "@/components/ui/metric-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { StatusPill } from "@/components/ui/status-pill";
import { requireRole } from "@/lib/authz";
import { getLibrarianStats, getLoanRows, getReservationRows } from "@/lib/librarian";

export default async function LibrarianDashboardPage() {
  await requireRole(["ADMIN", "LIBRARIAN"]);
  const stats = getLibrarianStats();
  const loans = getLoanRows();
  const reservations = getReservationRows();

  return (
    <div className="space-y-6">
      <SectionHeading
        description="Operational overview for circulation, returns, reservations, copy availability, and member support."
        eyebrow="Librarian"
        title="Operations workspace"
      />
      <div className="grid gap-4 md:grid-cols-5">
        <MetricCard icon={<ClipboardList className="h-5 w-5" />} label="Active loans" value={stats.activeLoans} />
        <MetricCard icon={<Clock3 className="h-5 w-5" />} label="Overdue" value={stats.overdueLoans} tone="danger" />
        <MetricCard icon={<Library className="h-5 w-5" />} label="Pending holds" value={stats.pendingReservations} tone="warning" />
        <MetricCard icon={<BookCopy className="h-5 w-5" />} label="Available copies" value={stats.availableCopies} tone="success" />
        <MetricCard icon={<Users className="h-5 w-5" />} label="Members" value={stats.activeMembers} tone="accent" />
      </div>
      <section className="grid gap-5 xl:grid-cols-2">
        <div>
          <h2 className="mb-3 text-lg font-semibold text-ink">Current circulation</h2>
          <DataTable
            columns={["Member", "Title", "Copy", "Due", "Status"]}
            rows={loans.slice(0, 5).map((loan) => [
              loan.userEmail,
              loan.book?.title,
              loan.copyCode,
              loan.dueLabel,
              <StatusPill key={loan.copyCode} status={loan.status} />,
            ])}
          />
        </div>
        <div>
          <h2 className="mb-3 text-lg font-semibold text-ink">Reservation queue</h2>
          <DataTable
            columns={["Member", "Title", "Queue", "Status"]}
            rows={reservations.map((reservation) => [
              reservation.userEmail,
              reservation.book?.title,
              reservation.queuePosition,
              <StatusPill key={reservation.id} status={reservation.status} />,
            ])}
          />
        </div>
      </section>
    </div>
  );
}
