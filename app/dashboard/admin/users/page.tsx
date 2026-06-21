import { DataTable } from "@/components/ui/data-table";
import { SectionHeading } from "@/components/ui/section-heading";
import { StatusPill } from "@/components/ui/status-pill";
import { requireRole } from "@/lib/authz";
import { users } from "@/lib/seed-data";
import { updateUserAccessAction } from "../admin-actions";

export default async function AdminUsersPage() {
  await requireRole(["ADMIN"]);

  return (
    <div className="space-y-6">
      <SectionHeading description="Admins manage account role and status from the server side." eyebrow="Users" title="User access" />
      <section className="rounded-lg border border-border bg-surface p-5">
        <h2 className="text-lg font-semibold text-ink">Update access</h2>
        <form action={updateUserAccessAction} className="mt-4 grid gap-3 md:grid-cols-[1.2fr_1fr_1fr_auto]">
          <input className="focus-ring h-10 rounded-md border border-border px-3 text-sm" defaultValue="librarian@urlibrary.demo" name="email" />
          <select className="focus-ring h-10 rounded-md border border-border px-3 text-sm" name="role" defaultValue="LIBRARIAN">
            <option value="ADMIN">ADMIN</option>
            <option value="LIBRARIAN">LIBRARIAN</option>
            <option value="MEMBER">MEMBER</option>
          </select>
          <select className="focus-ring h-10 rounded-md border border-border px-3 text-sm" name="status" defaultValue="ACTIVE">
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
            <option value="SUSPENDED">SUSPENDED</option>
          </select>
          <button className="focus-ring h-10 rounded-md bg-primary px-4 text-sm font-semibold text-white" type="submit">
            Save
          </button>
        </form>
      </section>
      <DataTable
        columns={["Name", "Email", "Role", "Status", "Code"]}
        rows={users.map((user) => [
          user.name,
          user.email,
          user.role,
          <StatusPill key={user.email} status={user.status} />,
          user.memberCode,
        ])}
      />
    </div>
  );
}
