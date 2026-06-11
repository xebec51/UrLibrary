import Link from "next/link";
import { BookOpen, LogIn } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";

const navItems = [
  { href: "/catalog", label: "Catalog" },
  { href: "/authors", label: "Authors" },
  { href: "/categories", label: "Categories" },
  { href: "/about", label: "About" },
];

export function PublicNav() {
  return (
    <header className="border-b border-border bg-surface/95">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <Logo />
        <nav aria-label="Public navigation" className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              className="focus-ring rounded-md px-3 py-2 text-sm font-medium text-ink-muted hover:bg-surface-muted hover:text-ink"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ButtonLink href="/catalog" size="sm" variant="secondary">
            <BookOpen className="h-4 w-4" />
            Catalog
          </ButtonLink>
          <ButtonLink href="/login" size="sm">
            <LogIn className="h-4 w-4" />
            Login
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}
