import Link from "next/link";
import { Suspense } from "react";
import { PublicShell } from "@/components/layout/public-shell";
import { Badge } from "@/components/ui/badge";
import { LoginForm } from "./login-form";
import { demoPassword, users } from "@/lib/seed-data";

export default function LoginPage() {
  return (
    <PublicShell>
      <main className="mx-auto grid min-h-[78vh] max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <section className="flex flex-col justify-center">
          <Badge tone="primary">Secure workspace</Badge>
          <h1 className="mt-5 text-3xl font-semibold text-ink">Sign in to UrLibrary Nexus</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-ink-muted">
            Demo credentials are available for admin, librarian, and member workflows. Sessions are
            stored in signed HTTP-only cookies through NextAuth.
          </p>
          <div className="mt-6 grid gap-3">
            {users.map((user) => (
              <div className="rounded-lg border border-border bg-surface p-4" key={user.email}>
                <p className="text-sm font-semibold text-ink">{user.email}</p>
                <p className="mt-1 text-xs text-ink-muted">
                  {user.role} / password: {demoPassword}
                </p>
              </div>
            ))}
          </div>
        </section>
        <section className="flex items-center">
          <div className="w-full rounded-lg border border-border bg-surface p-6 shadow-soft">
            <Suspense>
              <LoginForm />
            </Suspense>
            <p className="mt-5 text-center text-sm text-ink-muted">
              New member?{" "}
              <Link className="font-semibold text-primary hover:text-primary-dark" href="/register">
                Create an account
              </Link>
            </p>
          </div>
        </section>
      </main>
    </PublicShell>
  );
}
