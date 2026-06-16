import { Bell } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeading } from "@/components/ui/section-heading";
import { requireRole } from "@/lib/authz";
import { getMemberWorkspace } from "@/lib/member";

export default async function NotificationsPage() {
  const user = await requireRole(["ADMIN", "LIBRARIAN", "MEMBER"]);
  const workspace = getMemberWorkspace(user.email);

  return (
    <div className="space-y-6">
      <SectionHeading description="In-app reminders for due dates, reservations, fines, and system events." eyebrow="Inbox" title="Notifications" />
      {workspace.notifications.length ? (
        <div className="space-y-3">
          {workspace.notifications.map((notification) => (
            <article className="rounded-lg border border-border bg-surface p-5" key={notification.title}>
              <p className="text-xs font-semibold uppercase text-primary">{notification.type.replaceAll("_", " ")}</p>
              <h2 className="mt-2 text-base font-semibold text-ink">{notification.title}</h2>
              <p className="mt-2 text-sm leading-6 text-ink-muted">{notification.message}</p>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState description="New reminders will appear here." icon={<Bell className="h-8 w-8" />} title="No notifications" />
      )}
    </div>
  );
}
