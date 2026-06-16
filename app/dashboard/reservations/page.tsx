import { DataTable } from "@/components/ui/data-table";
import { SectionHeading } from "@/components/ui/section-heading";
import { StatusPill } from "@/components/ui/status-pill";
import { requireRole } from "@/lib/authz";
import { getMemberWorkspace } from "@/lib/member";
import { cancelReservationAction, reserveBookAction } from "../member-actions";

export default async function ReservationsPage() {
  const user = await requireRole(["ADMIN", "LIBRARIAN", "MEMBER"]);
  const workspace = getMemberWorkspace(user.email);

  return (
    <div className="space-y-6">
      <SectionHeading
        description="Reservations use FIFO queue positions and can be cancelled while pending."
        eyebrow="Holds"
        title="My reservations"
      />
      <section className="rounded-lg border border-border bg-surface p-5">
        <h2 className="text-lg font-semibold text-ink">Reserve a title</h2>
        <form action={reserveBookAction} className="mt-4 grid gap-3 md:grid-cols-[1fr_auto]">
          <select className="focus-ring h-10 rounded-md border border-border px-3 text-sm" name="bookSlug">
            <option value="atomic-habits">Atomic Habits</option>
            <option value="clean-code">Clean Code</option>
            <option value="laskar-pelangi">Laskar Pelangi</option>
          </select>
          <button className="focus-ring h-10 rounded-md bg-primary px-4 text-sm font-semibold text-white" type="submit">
            Reserve
          </button>
        </form>
      </section>
      <DataTable
        columns={["Title", "Queue", "Status", "Reserved", "Expires", "Action"]}
        rows={workspace.reservations.map((reservation) => [
          reservation.book?.title ?? "Unknown title",
          reservation.queuePosition,
          <StatusPill key={reservation.bookSlug} status={reservation.status} />,
          new Date(reservation.reservedAt).toLocaleDateString("id-ID"),
          reservation.expiresAt ? new Date(reservation.expiresAt).toLocaleDateString("id-ID") : "N/A",
          reservation.status === "PENDING" ? (
            <form action={cancelReservationAction} key={reservation.bookSlug}>
              <input name="bookSlug" type="hidden" value={reservation.bookSlug} />
              <button className="text-sm font-semibold text-danger" type="submit">
                Cancel
              </button>
            </form>
          ) : (
            "Locked"
          ),
        ])}
      />
    </div>
  );
}
