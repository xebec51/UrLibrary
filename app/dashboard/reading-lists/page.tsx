import Link from "next/link";
import { ListPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/section-heading";
import { requireRole } from "@/lib/authz";
import { getMemberWorkspace } from "@/lib/member";
import { createReadingListAction } from "../member-actions";

export default async function ReadingListsPage() {
  const user = await requireRole(["ADMIN", "LIBRARIAN", "MEMBER"]);
  const workspace = getMemberWorkspace(user.email);

  return (
    <div className="space-y-6">
      <SectionHeading
        description="Organize catalog titles into private or public reading plans."
        eyebrow="Member collection"
        title="Reading lists"
      />
      <section className="rounded-lg border border-border bg-surface p-5">
        <h2 className="text-lg font-semibold text-ink">Create list</h2>
        <form action={createReadingListAction} className="mt-4 grid gap-3 md:grid-cols-[1fr_1.5fr_auto]">
          <input className="focus-ring h-10 rounded-md border border-border px-3 text-sm" name="title" placeholder="List title" required />
          <input className="focus-ring h-10 rounded-md border border-border px-3 text-sm" name="description" placeholder="Description" />
          <button className="focus-ring inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-white" type="submit">
            <ListPlus className="h-4 w-4" />
            Create
          </button>
        </form>
      </section>
      <div className="grid gap-4 md:grid-cols-2">
        {workspace.readingLists.map((list) => (
          <Link className="focus-ring rounded-lg border border-border bg-surface p-5 shadow-sm hover:border-primary" href={`/dashboard/reading-lists/${list.id}`} key={list.id}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-base font-semibold text-ink">{list.title}</h2>
                <p className="mt-2 text-sm leading-6 text-ink-muted">{list.description}</p>
              </div>
              <Badge tone={list.isPublic ? "success" : "neutral"}>{list.isPublic ? "Public" : "Private"}</Badge>
            </div>
            <p className="mt-4 text-sm font-medium text-primary">{list.books.length} books</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
