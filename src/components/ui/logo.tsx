import Link from "next/link";
import { cn } from "@/lib/utils";

type LogoProps = {
  href?: string;
  compact?: boolean;
  className?: string;
};

export function Logo({ href = "/", compact = false, className }: LogoProps) {
  const mark = (
    <span className={cn("flex items-center gap-3", className)}>
      <svg
        aria-label="UrLibrary Nexus logo"
        className="h-9 w-9 shrink-0"
        role="img"
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>UrLibrary Nexus</title>
        <rect width="64" height="64" rx="14" fill="#EEF2FF" />
        <path
          d="M15 18.5C20.6 16.2 26.1 16.4 32 20.1C37.9 16.4 43.4 16.2 49 18.5V45.8C43.2 43.7 37.5 43.9 32 47.7C26.5 43.9 20.8 43.7 15 45.8V18.5Z"
          fill="#FFFFFF"
          stroke="#4F46E5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3"
        />
        <path
          d="M32 20.1V47.7"
          stroke="#4F46E5"
          strokeLinecap="round"
          strokeWidth="3"
        />
        <path
          d="M40 16V36L44 32.8L48 36V18.2"
          fill="#F59E0B"
          stroke="#B7791F"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
        <path
          d="M22 24.5C24.6 24.4 27 25 29 26.2M22 31C24.4 30.9 26.6 31.4 28.5 32.4"
          stroke="#64748B"
          strokeLinecap="round"
          strokeWidth="2"
        />
      </svg>
      {!compact ? (
        <span className="leading-tight">
          <span className="block text-base font-semibold text-ink">UrLibrary</span>
          <span className="block text-xs font-medium text-primary">Nexus</span>
        </span>
      ) : null}
    </span>
  );

  return href ? <Link href={href}>{mark}</Link> : mark;
}
