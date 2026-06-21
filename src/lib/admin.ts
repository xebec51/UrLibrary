import { auditLogs, bookCopies, books, fines, librarySettings, loans, users } from "@/lib/seed-data";

export function getAdminStats() {
  return {
    totalBooks: books.length,
    totalCopies: bookCopies.length,
    totalMembers: users.filter((user) => user.role === "MEMBER").length,
    activeLoans: loans.filter((loan) => loan.status === "ACTIVE" || loan.status === "OVERDUE").length,
    overdueLoans: loans.filter((loan) => loan.status === "OVERDUE").length,
    unpaidFines: fines.filter((fine) => fine.status === "UNPAID").reduce((total, fine) => total + fine.amount, 0),
    auditEvents: auditLogs.length,
    settings: librarySettings,
  };
}
