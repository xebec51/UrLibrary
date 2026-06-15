import { Search } from "lucide-react";
import { categories, tags } from "@/lib/seed-data";

export function CatalogFilter({
  q,
  category,
  tag,
  availability,
  sort,
}: {
  q?: string;
  category?: string;
  tag?: string;
  availability?: string;
  sort?: string;
}) {
  return (
    <form className="grid gap-3 rounded-lg border border-border bg-surface p-4 md:grid-cols-[1.5fr_1fr_1fr_1fr_1fr_auto]" action="/catalog">
      <label className="relative">
        <span className="sr-only">Search catalog</span>
        <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-ink-muted" />
        <input
          className="focus-ring h-10 w-full rounded-md border border-border bg-white pl-9 pr-3 text-sm text-ink"
          defaultValue={q}
          name="q"
          placeholder="Search title, author, or ISBN"
          type="search"
        />
      </label>
      <select
        aria-label="Category"
        className="focus-ring h-10 rounded-md border border-border bg-white px-3 text-sm text-ink"
        defaultValue={category ?? ""}
        name="category"
      >
        <option value="">All categories</option>
        {categories.map((item) => (
          <option key={item.slug} value={item.slug}>
            {item.name}
          </option>
        ))}
      </select>
      <select
        aria-label="Tag"
        className="focus-ring h-10 rounded-md border border-border bg-white px-3 text-sm text-ink"
        defaultValue={tag ?? ""}
        name="tag"
      >
        <option value="">All tags</option>
        {tags.map((item) => (
          <option key={item.slug} value={item.slug}>
            {item.name}
          </option>
        ))}
      </select>
      <select
        aria-label="Availability"
        className="focus-ring h-10 rounded-md border border-border bg-white px-3 text-sm text-ink"
        defaultValue={availability ?? ""}
        name="availability"
      >
        <option value="">All availability</option>
        <option value="available">Available</option>
        <option value="borrowed">Borrowed</option>
        <option value="reserved">Reserved</option>
      </select>
      <select
        aria-label="Sort"
        className="focus-ring h-10 rounded-md border border-border bg-white px-3 text-sm text-ink"
        defaultValue={sort ?? "newest"}
        name="sort"
      >
        <option value="newest">Newest</option>
        <option value="title">Title</option>
        <option value="popular">Popular</option>
        <option value="rating">Rating</option>
      </select>
      <button className="focus-ring h-10 rounded-md bg-primary px-4 text-sm font-semibold text-white" type="submit">
        Apply
      </button>
    </form>
  );
}
