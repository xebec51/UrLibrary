import { Heart } from "lucide-react";
import { BookCard } from "@/components/catalog/book-card";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeading } from "@/components/ui/section-heading";
import { requireRole } from "@/lib/authz";
import { getMemberWorkspace } from "@/lib/member";
import { toggleFavoriteAction } from "../member-actions";

export default async function FavoritesPage() {
  const user = await requireRole(["ADMIN", "LIBRARIAN", "MEMBER"]);
  const workspace = getMemberWorkspace(user.email);

  return (
    <div className="space-y-6">
      <SectionHeading
        description="Favorites are scoped to the signed-in member and can be removed without affecting other members."
        eyebrow="Member collection"
        title="Favorite books"
      />
      {workspace.favorites.length ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {workspace.favorites.map((book) => (
            <div className="space-y-3" key={book.slug}>
              <BookCard book={book} />
              <form action={toggleFavoriteAction}>
                <input name="bookSlug" type="hidden" value={book.slug} />
                <button className="focus-ring w-full rounded-md border border-border bg-surface px-3 py-2 text-sm font-semibold text-ink hover:bg-surface-muted" type="submit">
                  Remove favorite
                </button>
              </form>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          description="Favorited books will appear here for quick access."
          icon={<Heart className="h-8 w-8" />}
          title="No favorites yet"
        />
      )}
    </div>
  );
}
