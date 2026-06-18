import type { ReservationStatus } from "@/lib/seed-data";

export type QueueReservation = {
  id: string;
  userId: string;
  queuePosition: number;
  status: ReservationStatus;
  reservedAt: Date;
};

export function nextQueuePosition(activeReservations: number) {
  return activeReservations + 1;
}

export function firstPendingReservation<T extends QueueReservation>(reservations: T[]) {
  return [...reservations]
    .filter((reservation) => reservation.status === "PENDING")
    .sort((left, right) => left.queuePosition - right.queuePosition || left.reservedAt.getTime() - right.reservedAt.getTime())[0];
}

export function resequenceQueue<T extends QueueReservation>(reservations: T[]) {
  return [...reservations]
    .filter((reservation) => reservation.status === "PENDING")
    .sort((left, right) => left.queuePosition - right.queuePosition || left.reservedAt.getTime() - right.reservedAt.getTime())
    .map((reservation, index) => ({
      id: reservation.id,
      queuePosition: index + 1,
    }));
}

export function reservationExpiryDate(readyAt: Date, expiryDays: number) {
  return new Date(readyAt.getTime() + expiryDays * 86_400_000);
}

export function isReservationExpired(expiresAt: Date | null | undefined, now = new Date()) {
  return Boolean(expiresAt && expiresAt.getTime() < now.getTime());
}
