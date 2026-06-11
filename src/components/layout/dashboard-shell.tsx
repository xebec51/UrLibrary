import Link from "next/link";
import type { ReactNode } from "react";
import {
  BarChart3,
  Bell,
  BookCopy,
  BookMarked,
  BookOpen,
  ClipboardList,
  Cog,
  Home,
  Library,
  LogOut,
  Shield,
  UserRound,
  Users,
} from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { initials } from "@/lib/utils";

type ShellUser = {
  name: string;
  email: string;
  role: "ADMIN" | "LIBRARIAN" | "MEMBER";
};

const groups = [
  {
    label: "Member",
    items: [
      { href: "/dashboard/my-library", label: "My Library", icon: BookMarked },
      { href: "/dashboard/favorites", label: "Favorites", icon: BookOpen },
      { href: "/dashboard/reading-lists", label: "Reading Lists", icon: ClipboardList },
      { href: "/dashboard/loans", label: "Loans", icon: BookCopy },
      { href: "/dashboard/reservations", label: "Reservations", icon: Bell },
      { href: "/dashboard/fines", label: "Fines", icon: BarChart3 },
    ],
  },
  {
    label: "Librarian",
    items: [
      { href: "/dashboard/librarian", label: "Operations", icon: Library },
      { href: "/dashboard/librarian/books", label: "Books", icon: BookOpen },
      { href: "/dashboard/librarian/copies", label: "Copies", icon: BookCopy },
      { href: "/dashboard/librarian/loans", label: "Loan Desk", icon: ClipboardList },
      { href: "/dashboard/librarian/members", label: "Members", icon: Users },
      { href: "/dashboard/librarian/reports", label: "Reports", icon: BarChart3 },
    ],
  },
  {
    label: "Admin",
    items: [
      { href: "/dashboard/admin", label: "Admin Home", icon: Shield },
      { href: "/dashboard/admin/users", label: "Users", icon: Users },
      { href: "/dashboard/admin/catalog", label: "Catalog", icon: BookOpen },
      { href: "/dashboard/admin/settings", label: "Settings", icon: Cog },
      { href: "/dashboard/admin/audit-logs", label: "Audit Logs", icon: ClipboardList },
      { href: "/dashboard/admin/reports", label: "Reports", icon: BarChart3 },
    ],
  },
];

export function DashboardShell({
  children,
  user,
}: {
  children: ReactNode;
  user: ShellUser;
}) {
  const visibleGroups = groups.filter((group) => {
    if (group.label === "Admin") return user.role === "ADMIN";
    if (group.label === "Librarian") return user.role === "ADMIN" || user.role === "LIBRARIAN";
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-border bg-surface lg:flex lg:flex-col">
        <div className="border-b border-border px-5 py-5">
          <Logo href="/dashboard" />
        </div>
        <nav className="flex-1 overflow-y-auto px-4 py-5" aria-label="Dashboard navigation">
          <Link
            className="focus-ring mb-5 flex items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold text-ink hover:bg-surface-muted"
            href="/dashboard"
          >
            <Home className="h-4 w-4 text-primary" />
            Dashboard
          </Link>
          <div className="space-y-6">
            {visibleGroups.map((group) => (
              <div key={group.label}>
                <p className="px-3 text-xs font-semibold uppercase text-ink-muted">
                  {group.label}
                </p>
                <div className="mt-2 space-y-1">
                  {group.items.map((item) => (
                    <Link
                      className="focus-ring flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-ink-muted hover:bg-surface-muted hover:text-ink"
                      href={item.href}
                      key={item.href}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </nav>
        <div className="border-t border-border p-4">
          <div className="flex items-center gap-3 rounded-lg bg-surface-muted p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-sm font-semibold text-white">
              {initials(user.name)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-ink">{user.name}</p>
              <p className="truncate text-xs text-ink-muted">{user.role}</p>
            </div>
            <LogOut className="h-4 w-4 text-ink-muted" />
          </div>
        </div>
      </aside>
      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-border bg-surface/95 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <Logo compact className="lg:hidden" />
            <div className="hidden lg:block">
              <p className="text-sm font-medium text-ink-muted">UrLibrary Nexus workspace</p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                className="focus-ring rounded-md p-2 text-ink-muted hover:bg-surface-muted hover:text-ink"
                href="/dashboard/notifications"
                title="Notifications"
              >
                <Bell className="h-5 w-5" />
              </Link>
              <Link
                className="focus-ring rounded-md p-2 text-ink-muted hover:bg-surface-muted hover:text-ink"
                href="/dashboard/profile"
                title="Profile"
              >
                <UserRound className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </header>
        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
