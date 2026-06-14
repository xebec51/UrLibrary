import { ShieldAlert } from "lucide-react";
import { PublicShell } from "@/components/layout/public-shell";
import { ButtonLink } from "@/components/ui/button";

export default function UnauthorizedPage() {
  return (
    <PublicShell>
      <main className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-4 py-12 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-md bg-red-50 text-danger">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <h1 className="mt-5 text-2xl font-semibold text-ink">Access unavailable</h1>
        <p className="mt-3 text-sm leading-6 text-ink-muted">
          This workspace requires an active account with the right role. Sensitive actions are
          guarded on the server, not only hidden from navigation.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/login">Sign in</ButtonLink>
          <ButtonLink href="/catalog" variant="secondary">
            Back to catalog
          </ButtonLink>
        </div>
      </main>
    </PublicShell>
  );
}
