import { DataTable } from "@/components/ui/data-table";
import { SectionHeading } from "@/components/ui/section-heading";
import { requireRole } from "@/lib/authz";
import { auditLogs } from "@/lib/seed-data";

export default async function AuditLogsPage() {
  await requireRole(["ADMIN"]);
  return (
    <div className="space-y-6">
      <SectionHeading description="Audit records capture privileged catalog, circulation, reservation, fine, and export actions." eyebrow="Audit" title="Audit logs" />
      <DataTable columns={["Actor", "Action", "Module", "Description"]} rows={auditLogs.map((log) => [log.userEmail, log.action, log.module, log.description])} />
    </div>
  );
}
