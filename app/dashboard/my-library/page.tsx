import { Bell, BookCopy, BookOpen, CalendarClock, Heart, WalletCards } from "lucide-react";
import { BookCard } from "@/components/catalog/book-card";
import { Badge } from "@/components/ui/badge";
import { MetricCard } from "@/components/ui/metric-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { StatusPill } from "@/components/ui/status-pill";
import { getMemberWorkspace } from "@/lib/member";
import { requireRole } from "@/lib/authz";

export default async function MyLibraryPage() {
  const user = await requireRole(["ADMIN", "LIBRARIAN", "MEMBER"]);
  const workspace = getMemberWorkspace(user.email);
  const activeLoans = workspace.loans.filter((loan) => loan.status === "ACTIVE" || loan.status === "OVERDUE");
  const dueSoon = activeLoans.filter((loan) => loan.isDueSoon);
  const unpaidFineTotal = workspace.fines
    .filter((fine) => fine.status === "UNPAID")
    .reduce((total, fine) => total + fine.amount, 0);

  return (
    <div className="space-y-6">
      <SectionHeading
        description="Personal circulation, reservations, reading plans, reviews, and notifications for the active member account."
        eyebrow="Member dashboard"
        title="My library"
      />
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard icon={<BookCopy className="h-5 w-5" />} label="Active loans" value={activeLoans.length} />
        <MetricCard icon={<CalendarClock className="h-5 w-5" />} label="Due soon" value={dueSoon.length} tone="warning" />
        <MetricCard icon={<Heart className="h-5 w-5" />} label="Favorites" value={workspace.favorites.length} tone="accent" />
        <MetricCard icon={<WalletCards className="h-5 w-5" />} label="Unpaid fines" value={`IDR ${unpaidFineTotal.toLocaleString("id-ID")}`} tone="danger" />
      </div>
      <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-lg border border-border bg-surface p-5">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-ink">Current loans</h2>
            <Badge tone="primary">{activeLoans.length} active</Badge>
          </div>
          <div className="mt-4 space-y-4">
            {activeLoans.map((loan) => (
              <article className="flex items-start gap-4 border-b border-border pb-4 last:border-b-0 last:pb-0" key={loan.copyCode}>
                <BookOpen className="mt-1 h-5 w-5 text-primary" />
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-ink">{loan.book?.title}</h3>
                  <p className="mt-1 text-sm text-ink-muted">
                    Copy {loan.copyCode} due {loan.dueLabel}
                  </p>
                </div>
                <StatusPill status={loan.status} />
              </article>
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-border bg-surface p-5">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-ink">Notifications</h2>
            <Bell className="h-5 w-5 text-primary" />
          </div>
          <div className="mt-4 space-y-4">
            {workspace.notifications.map((notification) => (
              <article className="rounded-md bg-surface-muted p-3" key={notification.title}>
                <p className="text-sm font-semibold text-ink">{notification.title}</p>
                <p className="mt-1 text-sm leading-6 text-ink-muted">{notification.message}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section>
        <h2 className="mb-4 text-lg font-semibold text-ink">Favorite titles</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {workspace.favorites.slice(0, 3).map((book) => (
            <BookCard book={book} key={book.slug} />
          ))}
        </div>
      </section>
    </div>
  );
}
