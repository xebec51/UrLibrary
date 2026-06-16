import { UserRound } from "lucide-react";
import { MetricCard } from "@/components/ui/metric-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { requireRole } from "@/lib/authz";
import { getMemberWorkspace } from "@/lib/member";

export default async function ProfilePage() {
  const user = await requireRole(["ADMIN", "LIBRARIAN", "MEMBER"]);
  const workspace = getMemberWorkspace(user.email);
  const profile = workspace.user;

  return (
    <div className="space-y-6">
      <SectionHeading description="Member profile information used for circulation and staff contact." eyebrow="Profile" title={user.name ?? "Profile"} />
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard icon={<UserRound className="h-5 w-5" />} label="Role" value={user.role} />
        <MetricCard label="Status" value={user.status} tone={user.status === "ACTIVE" ? "success" : "danger"} />
        <MetricCard label="Member code" value={profile?.memberCode ?? "N/A"} tone="accent" />
      </div>
      <section className="rounded-lg border border-border bg-surface p-5">
        <dl className="grid gap-4 md:grid-cols-2">
          {[
            ["Email", user.email ?? "N/A"],
            ["Phone", profile?.phone ?? "N/A"],
            ["Address", profile?.address ?? "N/A"],
            ["Notes", profile?.notes ?? "N/A"],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs font-semibold uppercase text-ink-muted">{label}</dt>
              <dd className="mt-1 text-sm font-medium text-ink">{value}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
