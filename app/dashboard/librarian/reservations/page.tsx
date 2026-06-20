import { DataTable } from "@/components/ui/data-table";
import { SectionHeading } from "@/components/ui/section-heading";
import { StatusPill } from "@/components/ui/status-pill";
import { requireRole } from "@/lib/authz";
import { getReservationRows } from "@/lib/librarian";
import { createReservationForMemberAction, expireReservationsAction, markReservationReadyAction } from "../reservation-actions";

export default async function LibrarianReservationsPage() {
  await requireRole(["ADMIN", "LIBRARIAN"]);
  const reservations = getReservationRows();

  return (
    <div className="space-y-6">
      <SectionHeading description="Manage FIFO holds, pickup readiness, and reservation expiry." eyebrow="Reservations" title="Reservation desk" />
      <section className="grid gap-4 rounded-lg border border-border bg-surface p-5 lg:grid-cols-[1fr_auto]">
        <form action={createReservationForMemberAction} className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
          <input className="focus-ring h-10 rounded-md border border-border px-3 text-sm" defaultValue="member@urlibrary.demo" name="memberEmail" />
          <input className="focus-ring h-10 rounded-md border border-border px-3 text-sm" defaultValue="sapiens" name="bookSlug" />
          <button className="focus-ring h-10 rounded-md bg-primary px-4 text-sm font-semibold text-white" type="submit">
            Add hold
          </button>
        </form>
        <form action={expireReservationsAction}>
          <button className="focus-ring h-10 rounded-md border border-border px-4 text-sm font-semibold text-ink" type="submit">
            Expire old holds
          </button>
        </form>
      </section>
      <section className="rounded-lg border border-border bg-surface p-5">
        <form action={markReservationReadyAction} className="grid gap-3 md:grid-cols-[1fr_auto]">
          <input className="focus-ring h-10 rounded-md border border-border px-3 text-sm" defaultValue="sapiens" name="bookSlug" />
          <button className="focus-ring h-10 rounded-md bg-primary px-4 text-sm font-semibold text-white" type="submit">
            Mark first ready
          </button>
        </form>
      </section>
      <DataTable
        columns={["Member", "Title", "Queue", "Reserved", "Status"]}
        rows={reservations.map((reservation) => [
          reservation.userEmail,
          reservation.book?.title,
          reservation.queuePosition,
          reservation.reservedLabel,
          <StatusPill key={reservation.id} status={reservation.status} />,
        ])}
      />
    </div>
  );
}
