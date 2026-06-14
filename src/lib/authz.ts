import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { canAccessRole, roleHome, type AppRole } from "@/lib/auth-utils";

export async function getCurrentUser() {
  const session = await auth();
  return session?.user ?? null;
}

export async function requireActiveUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.status !== "ACTIVE") redirect("/unauthorized");
  return user;
}

export async function requireRole(allowed: AppRole[]) {
  const user = await requireActiveUser();
  if (!canAccessRole(user.role, allowed)) redirect("/unauthorized");
  return user;
}

export async function redirectToRoleHome() {
  const user = await requireActiveUser();
  redirect(roleHome[user.role]);
}
