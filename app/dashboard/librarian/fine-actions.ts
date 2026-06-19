"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { fineStatusAfterPayment } from "@/lib/fines";
import { requireRole } from "@/lib/authz";
import { prisma } from "@/lib/prisma";

const fineSchema = z.object({
  fineId: z.string().min(1),
});

export async function payFineAction(formData: FormData) {
  const staff = await requireRole(["ADMIN", "LIBRARIAN"]);
  const parsed = fineSchema.safeParse({ fineId: formData.get("fineId") });
  if (!parsed.success) return;

  try {
    const fine = await prisma.fine.update({
      where: { id: parsed.data.fineId },
      data: {
        status: fineStatusAfterPayment(true),
        paidAt: new Date(),
      },
    });
    await prisma.auditLog.create({
      data: {
        userId: staff.id,
        action: "PAY_FINE",
        module: "fines",
        description: "Marked fine as paid.",
        metadataJson: { fineId: fine.id, amount: fine.amount },
      },
    });
  } catch {
  } finally {
    revalidatePath("/dashboard/librarian/reports");
    revalidatePath("/dashboard/admin/reports");
  }
}

export async function waiveFineAction(formData: FormData) {
  const staff = await requireRole(["ADMIN"]);
  const parsed = fineSchema.safeParse({ fineId: formData.get("fineId") });
  if (!parsed.success) return;

  try {
    const fine = await prisma.fine.update({
      where: { id: parsed.data.fineId },
      data: {
        status: fineStatusAfterPayment(false),
        waivedAt: new Date(),
      },
    });
    await prisma.auditLog.create({
      data: {
        userId: staff.id,
        action: "WAIVE_FINE",
        module: "fines",
        description: "Waived fine by admin action.",
        metadataJson: { fineId: fine.id, amount: fine.amount },
      },
    });
  } catch {
  } finally {
    revalidatePath("/dashboard/librarian/reports");
    revalidatePath("/dashboard/admin/reports");
  }
}
