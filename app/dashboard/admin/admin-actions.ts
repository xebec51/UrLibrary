"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireRole } from "@/lib/authz";
import { prisma } from "@/lib/prisma";

export async function updateUserAccessAction(formData: FormData) {
  const admin = await requireRole(["ADMIN"]);
  const parsed = z
    .object({
      email: z.string().email(),
      role: z.enum(["ADMIN", "LIBRARIAN", "MEMBER"]),
      status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"]),
    })
    .safeParse({
      email: formData.get("email"),
      role: formData.get("role"),
      status: formData.get("status"),
    });
  if (!parsed.success) return;

  try {
    const user = await prisma.user.update({
      where: { email: parsed.data.email.toLowerCase() },
      data: { role: parsed.data.role, status: parsed.data.status },
    });
    await prisma.auditLog.create({
      data: {
        userId: admin.id,
        action: "UPDATE",
        module: "users",
        description: `Updated access for ${user.email}`,
        metadataJson: { targetUserId: user.id, role: user.role, status: user.status },
      },
    });
  } catch {
  } finally {
    revalidatePath("/dashboard/admin/users");
  }
}

export async function updateLibrarySettingsAction(formData: FormData) {
  const admin = await requireRole(["ADMIN"]);
  const parsed = z
    .object({
      maxActiveLoans: z.coerce.number().int().min(1),
      loanDurationDays: z.coerce.number().int().min(1),
      maxRenewals: z.coerce.number().int().min(0),
      dailyFineAmount: z.coerce.number().min(0),
      fineLimit: z.coerce.number().min(0),
      reservationExpiryDays: z.coerce.number().int().min(1),
    })
    .safeParse({
      maxActiveLoans: formData.get("maxActiveLoans"),
      loanDurationDays: formData.get("loanDurationDays"),
      maxRenewals: formData.get("maxRenewals"),
      dailyFineAmount: formData.get("dailyFineAmount"),
      fineLimit: formData.get("fineLimit"),
      reservationExpiryDays: formData.get("reservationExpiryDays"),
    });
  if (!parsed.success) return;

  try {
    const existing = await prisma.librarySetting.findFirst();
    if (existing) {
      await prisma.librarySetting.update({ where: { id: existing.id }, data: parsed.data });
    } else {
      await prisma.librarySetting.create({ data: parsed.data });
    }
    await prisma.auditLog.create({
      data: {
        userId: admin.id,
        action: "UPDATE",
        module: "settings",
        description: "Updated library circulation settings.",
        metadataJson: parsed.data,
      },
    });
  } catch {
  } finally {
    revalidatePath("/dashboard/admin/settings");
  }
}
