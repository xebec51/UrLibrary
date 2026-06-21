import { BookOpen, ClipboardList, Clock3, Copy, Users, WalletCards } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { MetricCard } from "@/components/ui/metric-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { requireRole } from "@/lib/authz";
import { getAdminStats } from "@/lib/admin";
import { auditLogs } from "@/lib/seed-data";
import { formatCurrency } from "@/lib/utils";

export default async function AdminDashboardPage() {
  await requireRole(["ADMIN"]);
  const stats = getAdminStats();

  return (
    <div className="space-y-6">
      <SectionHeading description="System overview for catalog, members, circulation, fines, settings, and audit activity." eyebrow="Admin" title="System management" />
      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        <MetricCard icon={<BookOpen className="h-5 w-5" />} label="Books" value={stats.totalBooks} />
        <MetricCard icon={<Copy className="h-5 w-5" />} label="Copies" value={stats.totalCopies} tone="success" />
        <MetricCard icon={<Users className="h-5 w-5" />} label="Members" value={stats.totalMembers} tone="accent" />
        <MetricCard icon={<ClipboardList className="h-5 w-5" />} label="Active loans" value={stats.activeLoans} />
        <MetricCard icon={<Clock3 className="h-5 w-5" />} label="Overdue" value={stats.overdueLoans} tone="danger" />
        <MetricCard icon={<WalletCards className="h-5 w-5" />} label="Unpaid fines" value={formatCurrency(stats.unpaidFines)} tone="warning" />
      </div>
      <section>
        <h2 className="mb-3 text-lg font-semibold text-ink">Recent system activity</h2>
        <DataTable
          columns={["Actor", "Action", "Module", "Description"]}
          rows={auditLogs.map((log) => [log.userEmail, log.action, log.module, log.description])}
        />
      </section>
    </div>
  );
}
