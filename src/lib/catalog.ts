import {
  authors,
  bookCopies,
  books,
  categories,
  favorites,
  getAvailability,
  getAverageRating,
  publishers,
  reservations,
  reviews,
  tags,
} from "@/lib/seed-data";

export type CatalogQuery = {
  q?: string;
  category?: string;
  tag?: string;
  availability?: "available" | "borrowed" | "reserved";
  sort?: "newest" | "title" | "popular" | "rating";
  page?: number;
  pageSize?: number;
};

export function enrichBook(book: (typeof books)[number]) {
  const availability = getAvailability(book.slug);
  const rating = getAverageRating(book.slug);
  return {
    ...book,
    publisher: publishers.find((publisher) => publisher.slug === book.publisherSlug),
    authors: book.authorSlugs
      .map((slug) => authors.find((author) => author.slug === slug))
      .filter((author) => Boolean(author)),
    categories: book.categorySlugs
      .map((slug) => categories.find((category) => category.slug === slug))
      .filter((category) => Boolean(category)),
    tags: book.tagSlugs.map((slug) => tags.find((tag) => tag.slug === slug)).filter((tag) => Boolean(tag)),
    availability,
    rating,
    reviewCount: reviews.filter((review) => review.bookSlug === book.slug).length,
    favoriteCount: favorites.filter((favorite) => favorite.bookSlug === book.slug).length,
    reservationCount: reservations.filter((reservation) => reservation.bookSlug === book.slug).length,
  };
}

export type EnrichedBook = ReturnType<typeof enrichBook>;

export function getCatalogBooks(query: CatalogQuery = {}) {
  const page = Math.max(1, query.page ?? 1);
  const pageSize = Math.min(24, Math.max(1, query.pageSize ?? 9));
  const q = query.q?.trim().toLowerCase();

  let records = books.map(enrichBook).filter((book) => {
    if (q) {
      const haystack = [
        book.title,
        book.isbn,
        ...book.authors.map((author) => author?.name),
        book.publisher?.name,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }

    if (query.category && !book.categorySlugs.includes(query.category)) return false;
    if (query.tag && !book.tagSlugs.includes(query.tag)) return false;

    if (query.availability === "available" && book.availability.available < 1) return false;
    if (query.availability === "borrowed" && book.availability.borrowed < 1) return false;
    if (query.availability === "reserved" && book.availability.reserved < 1) return false;

    return true;
  });

  records = records.sort((left, right) => {
    switch (query.sort) {
      case "title":
        return left.title.localeCompare(right.title);
      case "popular":
        return right.favoriteCount + right.reservationCount - (left.favoriteCount + left.reservationCount);
      case "rating":
        return right.rating - left.rating;
      case "newest":
      default:
        return (right.publicationYear ?? 0) - (left.publicationYear ?? 0);
    }
  });

  const total = records.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;

  return {
    items: records.slice(start, start + pageSize),
    total,
    page,
    pageSize,
    pageCount,
  };
}

export function getCatalogBook(slug: string) {
  const book = books.find((record) => record.slug === slug);
  return book ? enrichBook(book) : null;
}

export function getAuthor(slug: string) {
  const author = authors.find((record) => record.slug === slug);
  if (!author) return null;
  const authorBooks = books.filter((book) => book.authorSlugs.includes(slug)).map(enrichBook);
  return { ...author, books: authorBooks };
}

export function getCategory(slug: string) {
  const category = categories.find((record) => record.slug === slug);
  if (!category) return null;
  const categoryBooks = books.filter((book) => book.categorySlugs.includes(slug)).map(enrichBook);
  return { ...category, books: categoryBooks };
}

export function getBookCopySummary(slug: string) {
  return bookCopies.filter((copy) => copy.bookSlug === slug);
}
