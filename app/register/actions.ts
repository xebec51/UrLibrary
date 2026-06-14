"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

export type RegisterState = {
  ok: boolean;
  message: string;
};

export async function registerMember(
  _state: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { ok: false, message: "Please provide a valid name, email, and password." };
  }

  try {
    const password = await bcrypt.hash(parsed.data.password, 12);
    const user = await prisma.user.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email.toLowerCase(),
        password,
        role: "MEMBER",
        status: "ACTIVE",
      },
    });

    await prisma.libraryProfile.create({
      data: {
        userId: user.id,
        memberCode: `MBR-${new Date().getFullYear()}-${user.id.slice(-6).toUpperCase()}`,
      },
    });

    return { ok: true, message: "Account created. You can now sign in." };
  } catch {
    return {
      ok: false,
      message: "Registration needs a reachable database and a unique email address.",
    };
  }
}
