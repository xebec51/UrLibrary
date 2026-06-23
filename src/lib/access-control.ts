import type { AppRole } from "@/lib/auth-utils";

export function canManageCatalog(role: AppRole) {
  return role === "ADMIN" || role === "LIBRARIAN";
}

export function canManageSystem(role: AppRole) {
  return role === "ADMIN";
}

export function canReadMemberResource(input: {
  actorId: string;
  actorRole: AppRole;
  ownerId: string;
}) {
  return input.actorId === input.ownerId || input.actorRole === "ADMIN" || input.actorRole === "LIBRARIAN";
}

export function normalizePage(value: string | string[] | undefined, fallback = 1) {
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = Number(raw ?? fallback);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback;
}

export function normalizePageSize(value: string | string[] | undefined, fallback = 10, max = 50) {
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = Number(raw ?? fallback);
  if (!Number.isFinite(parsed) || parsed < 1) return fallback;
  return Math.min(max, Math.floor(parsed));
}
