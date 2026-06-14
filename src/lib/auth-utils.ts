import type { Role, UserStatus } from "@/lib/seed-data";

export type AppRole = Role;
export type AppUserStatus = UserStatus;

export const roleHome: Record<AppRole, string> = {
  ADMIN: "/dashboard/admin",
  LIBRARIAN: "/dashboard/librarian",
  MEMBER: "/dashboard/my-library",
};

export function canAccessRole(userRole: AppRole, allowed: AppRole[]) {
  return allowed.includes(userRole);
}

export function isPrivilegedRole(role: AppRole) {
  return role === "ADMIN" || role === "LIBRARIAN";
}
