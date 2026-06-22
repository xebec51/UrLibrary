import { bookCopies, books, favorites, fines, loans, reservations, reviews, users } from "@/lib/seed-data";
import { getCatalogBook } from "@/lib/catalog";

export function getReportSummary() {
  const activeLoans = loans.filter((loan) => loan.status === "ACTIVE" || loan.status === "OVERDUE");
  const overdueLoans = loans.filter((loan) => loan.status === "OVERDUE");
  const unpaidFines = fines.filter((fine) => fine.status === "UNPAID");
  return {
    catalog: {
      books: books.length,
      copies: bookCopies.length,
      available: bookCopies.filter((copy) => copy.status === "AVAILABLE").length,
      maintenance: bookCopies.filter((copy) => copy.status === "MAINTENANCE").length,
    },
    circulation: {
      activeLoans: activeLoans.length,
      overdueLoans: overdueLoans.length,
      returnedLoans: loans.filter((loan) => loan.status === "RETURNED").length,
      pendingReservations: reservations.filter((reservation) => reservation.status === "PENDING").length,
    },
    members: {
      activeMembers: users.filter((user) => user.role === "MEMBER" && user.status === "ACTIVE").length,
      staff: users.filter((user) => user.role !== "MEMBER").length,
    },
    fines: {
      unpaidCount: unpaidFines.length,
      unpaidAmount: unpaidFines.reduce((total, fine) => total + fine.amount, 0),
    },
  };
}

export function getCirculationChartData() {
  return [
    { name: "Active", value: loans.filter((loan) => loan.status === "ACTIVE").length },
    { name: "Overdue", value: loans.filter((loan) => loan.status === "OVERDUE").length },
    { name: "Returned", value: loans.filter((loan) => loan.status === "RETURNED").length },
    { name: "Reservations", value: reservations.filter((reservation) => reservation.status === "PENDING").length },
  ];
}

export function getTopBooks() {
  return books
    .map((book) => ({
      title: book.title,
      slug: book.slug,
      favorites: favorites.filter((favorite) => favorite.bookSlug === book.slug).length,
      reviews: reviews.filter((review) => review.bookSlug === book.slug).length,
      loans: loans.filter((loan) => getCatalogBook(book.slug)?.slug && loan.copyCode.includes(book.slug.slice(0, 2).toUpperCase())).length,
    }))
    .sort((left, right) => right.favorites + right.reviews - (left.favorites + left.reviews))
    .slice(0, 8);
}

export function getExportRows() {
  return {
    books: books.map((book) => ({
      title: book.title,
      isbn: book.isbn,
      language: book.language,
      publicationYear: book.publicationYear,
      shelf: book.locationShelf,
      copies: book.copyStatuses.length,
    })),
    loans: loans.map((loan) => ({
      member: loan.userEmail,
      copyCode: loan.copyCode,
      borrowedAt: loan.borrowedAt,
      dueAt: loan.dueAt,
      returnedAt: loan.returnedAt ?? "",
      status: loan.status,
    })),
    fines: fines.map((fine) => ({
      member: fine.userEmail,
      copyCode: fine.copyCode,
      amount: fine.amount,
      status: fine.status,
      reason: fine.reason,
    })),
  };
}
