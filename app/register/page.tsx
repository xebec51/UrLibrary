import Link from "next/link";
import { PublicShell } from "@/components/layout/public-shell";
import { Badge } from "@/components/ui/badge";
import { RegisterForm } from "./register-form";

export default function RegisterPage() {
  return (
    <PublicShell>
      <main className="mx-auto grid min-h-[78vh] max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <section className="flex flex-col justify-center">
          <Badge tone="accent">Member access</Badge>
          <h1 className="mt-5 text-3xl font-semibold text-ink">Create a library member account</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-ink-muted">
            Registration creates a MEMBER account with an attached library profile. Staff and admin
            roles are assigned from the protected admin workspace.
          </p>
        </section>
        <section className="flex items-center">
          <div className="w-full rounded-lg border border-border bg-surface p-6 shadow-soft">
            <RegisterForm />
            <p className="mt-5 text-center text-sm text-ink-muted">
              Already registered?{" "}
              <Link className="font-semibold text-primary hover:text-primary-dark" href="/login">
                Sign in
              </Link>
            </p>
          </div>
        </section>
      </main>
    </PublicShell>
  );
}
