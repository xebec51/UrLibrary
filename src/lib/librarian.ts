import { format, parseISO } from "date-fns";
import { getCatalogBook } from "@/lib/catalog";
import { bookCopies, books, loans, reservations, users } from "@/lib/seed-data";

export function getLibrarianStats() {
  return {
    activeLoans: loans.filter((loan) => loan.status === "ACTIVE" || loan.status === "OVERDUE").length,
    overdueLoans: loans.filter((loan) => loan.status === "OVERDUE").length,
    pendingReservations: reservations.filter((reservation) => reservation.status === "PENDING").length,
    availableCopies: bookCopies.filter((copy) => copy.status === "AVAILABLE").length,
    activeMembers: users.filter((user) => user.role === "MEMBER" && user.status === "ACTIVE").length,
  };
}

export function getLoanRows() {
  return loans.map((loan, index) => ({
    id: `demo-loan-${index + 1}`,
    ...loan,
    book: copyBook(loan.copyCode),
    borrowedLabel: format(parseISO(loan.borrowedAt), "dd MMM yyyy"),
    dueLabel: format(parseISO(loan.dueAt), "dd MMM yyyy"),
  }));
}

export function getReservationRows() {
  return reservations.map((reservation, index) => ({
    id: `demo-reservation-${index + 1}`,
    ...reservation,
    book: getCatalogBook(reservation.bookSlug),
    reservedLabel: format(parseISO(reservation.reservedAt), "dd MMM yyyy"),
  }));
}

export function getCopyRows() {
  return bookCopies.map((copy) => ({
    ...copy,
    book: getCatalogBook(copy.bookSlug),
  }));
}

function copyBook(copyCode: string) {
  const prefixes: Record<string, string> = {
    "URL-LP": "laskar-pelangi",
    "URL-LB": "laut-bercerita",
    "URL-AH": "atomic-habits",
    "URL-CC": "clean-code",
    "URL-N5M": "negeri-5-menara",
  };
  const prefix = copyCode.split("-").slice(0, -1).join("-");
  return getCatalogBook(prefixes[prefix] ?? books[0].slug);
}
