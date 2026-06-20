import { DataTable } from "@/components/ui/data-table";
import { SectionHeading } from "@/components/ui/section-heading";
import { StatusPill } from "@/components/ui/status-pill";
import { requireRole } from "@/lib/authz";
import { users } from "@/lib/seed-data";

export default async function LibrarianMembersPage() {
  await requireRole(["ADMIN", "LIBRARIAN"]);
  const members = users.filter((user) => user.role === "MEMBER");

  return (
    <div className="space-y-6">
      <SectionHeading description="Librarians can view member records for circulation support." eyebrow="Members" title="Member directory" />
      <DataTable
        columns={["Name", "Email", "Member code", "Status", "Notes"]}
        rows={members.map((member) => [
          member.name,
          member.email,
          member.memberCode,
          <StatusPill key={member.email} status={member.status} />,
          member.notes,
        ])}
      />
    </div>
  );
}
