import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function MetricCard({
  label,
  value,
  hint,
  icon,
  tone = "primary",
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  icon?: ReactNode;
  tone?: "primary" | "success" | "warning" | "danger" | "accent";
}) {
  const toneClass = {
    primary: "bg-primary-soft text-primary",
    success: "bg-green-50 text-success",
    warning: "bg-amber-50 text-warning",
    danger: "bg-red-50 text-danger",
    accent: "bg-amber-50 text-accent",
  }[tone];

  return (
    <article className="rounded-lg border border-border bg-surface p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-ink-muted">{label}</p>
          <div className="mt-2 text-2xl font-semibold text-ink">{value}</div>
        </div>
        {icon ? (
          <div className={cn("flex h-10 w-10 items-center justify-center rounded-md", toneClass)}>
            {icon}
          </div>
        ) : null}
      </div>
      {hint ? <p className="mt-3 text-sm text-ink-muted">{hint}</p> : null}
    </article>
  );
}
