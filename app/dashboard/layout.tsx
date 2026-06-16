import type { ReactNode } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { requireActiveUser } from "@/lib/authz";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const user = await requireActiveUser();

  return (
    <DashboardShell
      user={{
        name: user.name ?? "Library User",
        email: user.email ?? "",
        role: user.role,
      }}
    >
      {children}
    </DashboardShell>
  );
}
