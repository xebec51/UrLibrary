import type { ReactNode } from "react";
import { PublicNav } from "@/components/layout/public-nav";

export function PublicShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <PublicNav />
      {children}
    </div>
  );
}
