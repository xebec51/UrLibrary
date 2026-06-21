import { SectionHeading } from "@/components/ui/section-heading";
import { requireRole } from "@/lib/authz";
import { librarySettings } from "@/lib/seed-data";
import { updateLibrarySettingsAction } from "../admin-actions";

export default async function AdminSettingsPage() {
  await requireRole(["ADMIN"]);

  return (
    <div className="space-y-6">
      <SectionHeading description="System-level circulation settings are restricted to admins." eyebrow="Settings" title="Library settings" />
      <form action={updateLibrarySettingsAction} className="grid gap-4 rounded-lg border border-border bg-surface p-5 md:grid-cols-2">
        {[
          ["maxActiveLoans", "Max active loans", librarySettings.maxActiveLoans],
          ["loanDurationDays", "Loan duration days", librarySettings.loanDurationDays],
          ["maxRenewals", "Max renewals", librarySettings.maxRenewals],
          ["dailyFineAmount", "Daily fine amount", librarySettings.dailyFineAmount],
          ["fineLimit", "Fine limit", librarySettings.fineLimit],
          ["reservationExpiryDays", "Reservation expiry days", librarySettings.reservationExpiryDays],
        ].map(([name, label, value]) => (
          <label className="text-sm font-medium text-ink" key={String(name)}>
            {label}
            <input className="focus-ring mt-2 h-10 w-full rounded-md border border-border px-3 text-sm" defaultValue={String(value)} name={String(name)} type="number" />
          </label>
        ))}
        <div className="md:col-span-2">
          <button className="focus-ring rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white" type="submit">
            Save settings
          </button>
        </div>
      </form>
    </div>
  );
}
