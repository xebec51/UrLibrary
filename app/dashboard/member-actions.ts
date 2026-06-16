"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireRole } from "@/lib/authz";
import { prisma } from "@/lib/prisma";

const bookActionSchema = z.object({
  bookSlug: z.string().min(1),
});

export async function toggleFavoriteAction(formData: FormData) {
  const user = await requireRole(["ADMIN", "LIBRARIAN", "MEMBER"]);
  const parsed = bookActionSchema.safeParse({ bookSlug: formData.get("bookSlug") });
  if (!parsed.success) return;

  try {
    const book = await prisma.book.findUnique({ where: { slug: parsed.data.bookSlug } });
    if (!book) return;
    const existing = await prisma.favorite.findUnique({
      where: { userId_bookId: { userId: user.id, bookId: book.id } },
    });
    if (existing) {
      await prisma.favorite.delete({ where: { id: existing.id } });
    } else {
      await prisma.favorite.create({ data: { userId: user.id, bookId: book.id } });
    }
    revalidatePath("/dashboard/favorites");
  } catch {
    revalidatePath("/dashboard/favorites");
  }
}

export async function createReadingListAction(formData: FormData) {
  const user = await requireRole(["ADMIN", "LIBRARIAN", "MEMBER"]);
  const parsed = z
    .object({
      title: z.string().min(2),
      description: z.string().optional(),
    })
    .safeParse({
      title: formData.get("title"),
      description: formData.get("description"),
    });
  if (!parsed.success) return;

  try {
    await prisma.readingList.create({
      data: {
        userId: user.id,
        title: parsed.data.title,
        description: parsed.data.description,
      },
    });
    revalidatePath("/dashboard/reading-lists");
  } catch {
    revalidatePath("/dashboard/reading-lists");
  }
}

export async function reserveBookAction(formData: FormData) {
  const user = await requireRole(["ADMIN", "LIBRARIAN", "MEMBER"]);
  const parsed = bookActionSchema.safeParse({ bookSlug: formData.get("bookSlug") });
  if (!parsed.success) return;

  try {
    const [book, setting] = await Promise.all([
      prisma.book.findUnique({ where: { slug: parsed.data.bookSlug } }),
      prisma.librarySetting.findFirst(),
    ]);
    if (!book) return;
    const activeReservations = await prisma.reservation.count({
      where: { bookId: book.id, status: { in: ["PENDING", "READY_FOR_PICKUP"] } },
    });
    await prisma.reservation.create({
      data: {
        userId: user.id,
        bookId: book.id,
        queuePosition: activeReservations + 1,
        expiresAt: setting ? new Date(Date.now() + setting.reservationExpiryDays * 86_400_000) : undefined,
      },
    });
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "RESERVE",
        module: "reservations",
        description: `Reserved ${book.title}`,
        metadataJson: { bookId: book.id },
      },
    });
    revalidatePath("/dashboard/reservations");
  } catch {
    revalidatePath("/dashboard/reservations");
  }
}

export async function cancelReservationAction(formData: FormData) {
  await requireRole(["ADMIN", "LIBRARIAN", "MEMBER"]);
  const parsed = z.object({ bookSlug: z.string().min(1) }).safeParse({ bookSlug: formData.get("bookSlug") });
  if (!parsed.success) return;
  revalidatePath("/dashboard/reservations");
}

export async function upsertReviewAction(formData: FormData) {
  const user = await requireRole(["ADMIN", "LIBRARIAN", "MEMBER"]);
  const parsed = z
    .object({
      bookSlug: z.string().min(1),
      rating: z.coerce.number().min(1).max(5),
      title: z.string().optional(),
      body: z.string().min(5),
    })
    .safeParse({
      bookSlug: formData.get("bookSlug"),
      rating: formData.get("rating"),
      title: formData.get("title"),
      body: formData.get("body"),
    });
  if (!parsed.success) return;

  try {
    const book = await prisma.book.findUnique({ where: { slug: parsed.data.bookSlug } });
    if (!book) return;
    await prisma.review.upsert({
      where: { userId_bookId: { userId: user.id, bookId: book.id } },
      update: {
        rating: parsed.data.rating,
        title: parsed.data.title,
        body: parsed.data.body,
      },
      create: {
        userId: user.id,
        bookId: book.id,
        rating: parsed.data.rating,
        title: parsed.data.title,
        body: parsed.data.body,
      },
    });
    revalidatePath(`/catalog/${parsed.data.bookSlug}`);
  } catch {
    revalidatePath(`/catalog/${parsed.data.bookSlug}`);
  }
}
