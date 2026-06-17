"use server";

import { revalidatePath } from "next/cache";
import type { Prisma } from "@prisma/client";
import { z } from "zod";
import { calculateDueDate, calculateOverdueFine, checkBorrowEligibility, shouldReserveReturnedCopy } from "@/lib/circulation";
import { requireRole } from "@/lib/authz";
import { prisma } from "@/lib/prisma";

const issueLoanSchema = z.object({
  memberEmail: z.string().email(),
  copyCode: z.string().min(1),
});

export async function issueLoanAction(formData: FormData) {
  const staff = await requireRole(["ADMIN", "LIBRARIAN"]);
  const parsed = issueLoanSchema.safeParse({
    memberEmail: formData.get("memberEmail"),
    copyCode: formData.get("copyCode"),
  });
  if (!parsed.success) return;

  try {
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const [member, copy, setting] = await Promise.all([
        tx.user.findUnique({ where: { email: parsed.data.memberEmail.toLowerCase() } }),
        tx.bookCopy.findUnique({ where: { copyCode: parsed.data.copyCode }, include: { book: true } }),
        tx.librarySetting.findFirst(),
      ]);
      if (!member || !copy) return;

      const [activeLoans, unpaidFines] = await Promise.all([
        tx.loan.count({ where: { userId: member.id, status: { in: ["ACTIVE", "OVERDUE"] } } }),
        tx.fine.aggregate({ where: { userId: member.id, status: "UNPAID" }, _sum: { amount: true } }),
      ]);
      const maxActiveLoans = setting?.maxActiveLoans ?? 5;
      const loanDurationDays = setting?.loanDurationDays ?? 14;
      const fineLimit = Number(setting?.fineLimit ?? 50000);
      const eligibility = checkBorrowEligibility({
        userStatus: member.status,
        activeLoans,
        maxActiveLoans,
        unpaidFines: Number(unpaidFines._sum.amount ?? 0),
        fineLimit,
        copyStatus: copy.status,
      });
      if (!eligibility.ok) return;

      const borrowedAt = new Date();
      const dueAt = calculateDueDate(borrowedAt, loanDurationDays);
      const loan = await tx.loan.create({
        data: {
          userId: member.id,
          bookCopyId: copy.id,
          borrowedAt,
          dueAt,
          createdById: staff.id,
          notes: "Issued through the UrLibrary Nexus circulation desk.",
        },
      });

      await tx.bookCopy.update({ where: { id: copy.id }, data: { status: "BORROWED" } });
      await tx.notification.create({
        data: {
          userId: member.id,
          type: "DUE_SOON",
          title: "Loan created",
          message: `${copy.book.title} is due on ${dueAt.toLocaleDateString("id-ID")}.`,
        },
      });
      await tx.auditLog.create({
        data: {
          userId: staff.id,
          action: "BORROW",
          module: "loans",
          description: `Issued ${copy.copyCode} to ${member.email}`,
          metadataJson: { loanId: loan.id, copyCode: copy.copyCode, memberId: member.id },
        },
      });
    });
  } catch {
  } finally {
    revalidatePath("/dashboard/librarian/loans");
    revalidatePath("/dashboard/librarian");
  }
}

const returnLoanSchema = z.object({
  loanId: z.string().min(1),
});

export async function returnLoanAction(formData: FormData) {
  const staff = await requireRole(["ADMIN", "LIBRARIAN"]);
  const parsed = returnLoanSchema.safeParse({ loanId: formData.get("loanId") });
  if (!parsed.success) return;

  try {
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const loan = await tx.loan.findUnique({
        where: { id: parsed.data.loanId },
        include: { bookCopy: { include: { book: true } }, user: true },
      });
      if (!loan || loan.status === "RETURNED") return;

      const setting = await tx.librarySetting.findFirst();
      const returnedAt = new Date();
      const fine = calculateOverdueFine(loan.dueAt, returnedAt, Number(setting?.dailyFineAmount ?? 2000));
      const firstReservation = await tx.reservation.findFirst({
        where: { bookId: loan.bookCopy.bookId, status: "PENDING" },
        orderBy: [{ queuePosition: "asc" }, { reservedAt: "asc" }],
      });

      await tx.loan.update({
        where: { id: loan.id },
        data: {
          status: "RETURNED",
          returnedAt,
          returnedById: staff.id,
        },
      });
      await tx.bookCopy.update({
        where: { id: loan.bookCopyId },
        data: { status: shouldReserveReturnedCopy(Boolean(firstReservation)) },
      });

      if (fine.amount > 0) {
        await tx.fine.create({
          data: {
            userId: loan.userId,
            loanId: loan.id,
            amount: fine.amount,
            reason: `${fine.lateDays} days overdue at the configured daily rate.`,
          },
        });
        await tx.notification.create({
          data: {
            userId: loan.userId,
            type: "FINE_CREATED",
            title: "Overdue fine created",
            message: `${loan.bookCopy.book.title} generated an overdue fine.`,
          },
        });
      }

      if (firstReservation) {
        const expiresAt = new Date(Date.now() + (setting?.reservationExpiryDays ?? 3) * 86_400_000);
        await tx.reservation.update({
          where: { id: firstReservation.id },
          data: {
            status: "READY_FOR_PICKUP",
            readyAt: returnedAt,
            expiresAt,
          },
        });
        await tx.notification.create({
          data: {
            userId: firstReservation.userId,
            type: "RESERVATION_READY",
            title: "Reservation ready",
            message: `${loan.bookCopy.book.title} is ready for pickup.`,
          },
        });
      }

      await tx.auditLog.create({
        data: {
          userId: staff.id,
          action: "RETURN",
          module: "returns",
          description: `Returned ${loan.bookCopy.copyCode}`,
          metadataJson: { loanId: loan.id, lateDays: fine.lateDays, fineAmount: fine.amount },
        },
      });
    });
  } catch {
  } finally {
    revalidatePath("/dashboard/librarian/returns");
    revalidatePath("/dashboard/librarian/loans");
  }
}
