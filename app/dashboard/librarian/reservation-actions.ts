"use server";

import { revalidatePath } from "next/cache";
import type { Prisma } from "@prisma/client";
import { z } from "zod";
import { requireRole } from "@/lib/authz";
import { prisma } from "@/lib/prisma";
import { firstPendingReservation, nextQueuePosition, resequenceQueue, reservationExpiryDate } from "@/lib/reservation-queue";

export async function createReservationForMemberAction(formData: FormData) {
  const staff = await requireRole(["ADMIN", "LIBRARIAN"]);
  const parsed = z
    .object({
      memberEmail: z.string().email(),
      bookSlug: z.string().min(1),
    })
    .safeParse({
      memberEmail: formData.get("memberEmail"),
      bookSlug: formData.get("bookSlug"),
    });
  if (!parsed.success) return;

  try {
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const [member, book] = await Promise.all([
        tx.user.findUnique({ where: { email: parsed.data.memberEmail.toLowerCase() } }),
        tx.book.findUnique({ where: { slug: parsed.data.bookSlug } }),
      ]);
      if (!member || !book || member.status !== "ACTIVE") return;
      const activeReservations = await tx.reservation.count({
        where: { bookId: book.id, status: { in: ["PENDING", "READY_FOR_PICKUP"] } },
      });
      const reservation = await tx.reservation.create({
        data: {
          userId: member.id,
          bookId: book.id,
          queuePosition: nextQueuePosition(activeReservations),
          notes: "Created by staff from the reservation desk.",
        },
      });
      await tx.auditLog.create({
        data: {
          userId: staff.id,
          action: "RESERVE",
          module: "reservations",
          description: `Created reservation for ${member.email}`,
          metadataJson: { reservationId: reservation.id, bookId: book.id },
        },
      });
    });
  } catch {
  } finally {
    revalidatePath("/dashboard/librarian/reservations");
  }
}

export async function markReservationReadyAction(formData: FormData) {
  const staff = await requireRole(["ADMIN", "LIBRARIAN"]);
  const parsed = z.object({ bookSlug: z.string().min(1) }).safeParse({ bookSlug: formData.get("bookSlug") });
  if (!parsed.success) return;

  try {
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const book = await tx.book.findUnique({
        where: { slug: parsed.data.bookSlug },
        include: { reservations: true },
      });
      const setting = await tx.librarySetting.findFirst();
      if (!book) return;
      const first = firstPendingReservation(book.reservations);
      if (!first) return;
      const readyAt = new Date();
      const expiresAt = reservationExpiryDate(readyAt, setting?.reservationExpiryDays ?? 3);

      await tx.reservation.update({
        where: { id: first.id },
        data: { status: "READY_FOR_PICKUP", readyAt, expiresAt },
      });
      await tx.notification.create({
        data: {
          userId: first.userId,
          type: "RESERVATION_READY",
          title: "Reservation ready",
          message: `${book.title} is ready for pickup.`,
        },
      });
      await tx.auditLog.create({
        data: {
          userId: staff.id,
          action: "MARK_READY",
          module: "reservations",
          description: `Marked reservation ready for ${book.title}`,
          metadataJson: { reservationId: first.id, bookId: book.id },
        },
      });
    });
  } catch {
  } finally {
    revalidatePath("/dashboard/librarian/reservations");
  }
}

export async function fulfillReservationAction(formData: FormData) {
  const staff = await requireRole(["ADMIN", "LIBRARIAN"]);
  const parsed = z.object({ reservationId: z.string().min(1) }).safeParse({ reservationId: formData.get("reservationId") });
  if (!parsed.success) return;

  try {
    await prisma.reservation.update({
      where: { id: parsed.data.reservationId },
      data: { status: "FULFILLED", fulfilledAt: new Date() },
    });
    await prisma.auditLog.create({
      data: {
        userId: staff.id,
        action: "UPDATE",
        module: "reservations",
        description: "Fulfilled reservation pickup.",
        metadataJson: { reservationId: parsed.data.reservationId },
      },
    });
  } catch {
  } finally {
    revalidatePath("/dashboard/librarian/reservations");
  }
}

export async function cancelReservationByStaffAction(formData: FormData) {
  const staff = await requireRole(["ADMIN", "LIBRARIAN"]);
  const parsed = z.object({ reservationId: z.string().min(1) }).safeParse({ reservationId: formData.get("reservationId") });
  if (!parsed.success) return;

  try {
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const reservation = await tx.reservation.update({
        where: { id: parsed.data.reservationId },
        data: { status: "CANCELLED", cancelledAt: new Date() },
      });
      const remaining = await tx.reservation.findMany({
        where: { bookId: reservation.bookId, status: "PENDING" },
        orderBy: [{ queuePosition: "asc" }, { reservedAt: "asc" }],
      });
      for (const item of resequenceQueue(remaining)) {
        await tx.reservation.update({ where: { id: item.id }, data: { queuePosition: item.queuePosition } });
      }
      await tx.auditLog.create({
        data: {
          userId: staff.id,
          action: "CANCEL_RESERVATION",
          module: "reservations",
          description: "Cancelled reservation and resequenced queue.",
          metadataJson: { reservationId: reservation.id, bookId: reservation.bookId },
        },
      });
    });
  } catch {
  } finally {
    revalidatePath("/dashboard/librarian/reservations");
  }
}

export async function expireReservationsAction() {
  const staff = await requireRole(["ADMIN", "LIBRARIAN"]);
  try {
    const expired = await prisma.reservation.updateMany({
      where: {
        status: "READY_FOR_PICKUP",
        expiresAt: { lt: new Date() },
      },
      data: { status: "EXPIRED" },
    });
    await prisma.auditLog.create({
      data: {
        userId: staff.id,
        action: "UPDATE",
        module: "reservations",
        description: "Expired ready reservations past pickup window.",
        metadataJson: { count: expired.count },
      },
    });
  } catch {
  } finally {
    revalidatePath("/dashboard/librarian/reservations");
  }
}
