import { Code2, Database, GitBranch, ShieldCheck } from "lucide-react";
import { PublicShell } from "@/components/layout/public-shell";
import { MetricCard } from "@/components/ui/metric-card";
import { SectionHeading } from "@/components/ui/section-heading";

export default function AboutPage() {
  return (
    <PublicShell>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <SectionHeading
          description="UrLibrary Nexus preserves the original catalog project while modernizing it into a full-stack library management platform."
          eyebrow="About"
          title="From catalog CRUD to library operations"
        />
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <MetricCard icon={<GitBranch className="h-5 w-5" />} label="Migration" value="Legacy kept" />
          <MetricCard icon={<Database className="h-5 w-5" />} label="Data model" value="18+ tables" tone="success" />
          <MetricCard icon={<ShieldCheck className="h-5 w-5" />} label="Security" value="RBAC" tone="warning" />
          <MetricCard icon={<Code2 className="h-5 w-5" />} label="Stack" value="Next.js" tone="accent" />
        </div>
        <section className="mt-8 rounded-lg border border-border bg-surface p-6">
          <h2 className="text-lg font-semibold text-ink">Original project context</h2>
          <p className="mt-3 text-sm leading-7 text-ink-muted">
            The previous UrLibrary app used a React/Vite frontend and Flask backend for public
            catalog browsing, authentication, favorites, and admin book CRUD. The source is retained
            under `legacy/react-vite-flask/` while the root application now focuses on typed
            full-stack workflows, Prisma modeling, cookie sessions, and role-based operations.
          </p>
        </section>
      </main>
    </PublicShell>
  );
}
