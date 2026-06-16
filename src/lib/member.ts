import { addDays, format, parseISO } from "date-fns";
import { getCatalogBook, type EnrichedBook } from "@/lib/catalog";
import {
  favorites,
  fines,
  loans,
  notifications,
  readingLists,
  reservations,
  reviews,
  users,
} from "@/lib/seed-data";

export function getUserSeed(email?: string | null) {
  return users.find((user) => user.email === email) ?? users.find((user) => user.email === "member@urlibrary.demo");
}

function isDefined<T>(value: T | null | undefined): value is T {
  return value != null;
}

export function readingListId(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function getMemberWorkspace(email?: string | null) {
  const user = getUserSeed(email);
  const userEmail = user?.email ?? "member@urlibrary.demo";
  const memberFavorites = favorites
    .filter((favorite) => favorite.userEmail === userEmail)
    .map((favorite) => getCatalogBook(favorite.bookSlug))
    .filter(isDefined);
  const memberLists = readingLists
    .filter((list) => list.userEmail === userEmail)
    .map((list) => ({
      ...list,
      id: readingListId(list.title),
      books: list.items
        .map((item) => {
          const book = getCatalogBook(item.bookSlug);
          return book ? { ...book, notes: item.notes, order: item.order } : null;
        })
        .filter(isDefined),
    }));
  const memberLoans = loans
    .filter((loan) => loan.userEmail === userEmail)
    .map((loan) => {
      const copyPrefix = loan.copyCode.split("-").slice(1, -1).join("-").toLowerCase();
      const book = getBookByCopyCode(loan.copyCode);
      return {
        ...loan,
        book,
        dueLabel: format(parseISO(loan.dueAt), "dd MMM yyyy"),
        isDueSoon: addDays(new Date("2026-06-16T00:00:00.000Z"), 4) >= parseISO(loan.dueAt),
        copyPrefix,
      };
    });
  const memberReservations = reservations
    .filter((reservation) => reservation.userEmail === userEmail)
    .map((reservation) => ({ ...reservation, book: getCatalogBook(reservation.bookSlug) }));
  const memberFines = fines.filter((fine) => fine.userEmail === userEmail);
  const memberNotifications = notifications.filter((notification) => notification.userEmail === userEmail);
  const memberReviews = reviews
    .filter((review) => review.userEmail === userEmail)
    .map((review) => ({ ...review, book: getCatalogBook(review.bookSlug) }));

  return {
    user,
    favorites: memberFavorites,
    readingLists: memberLists,
    loans: memberLoans,
    reservations: memberReservations,
    fines: memberFines,
    notifications: memberNotifications,
    reviews: memberReviews,
  };
}

function getBookByCopyCode(copyCode: string): EnrichedBook | null {
  const codeMap = new Map(
    [
      ["URL-LP", "laskar-pelangi"],
      ["URL-LB", "laut-bercerita"],
      ["URL-AH", "atomic-habits"],
      ["URL-CC", "clean-code"],
      ["URL-N5M", "negeri-5-menara"],
    ].map(([prefix, slug]) => [prefix, slug]),
  );
  const prefix = copyCode.split("-").slice(0, -1).join("-");
  const slug = codeMap.get(prefix);
  return slug ? (getCatalogBook(slug) ?? getCatalogBook("laskar-pelangi")) : getCatalogBook("laskar-pelangi");
}
