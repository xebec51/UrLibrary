import { differenceInCalendarDays, addDays } from "date-fns";

export type BorrowEligibilityInput = {
  userStatus: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  activeLoans: number;
  maxActiveLoans: number;
  unpaidFines: number;
  fineLimit: number;
  copyStatus: "AVAILABLE" | "BORROWED" | "RESERVED" | "MAINTENANCE" | "LOST";
};

export function calculateDueDate(borrowedAt: Date, loanDurationDays: number) {
  return addDays(borrowedAt, loanDurationDays);
}

export function calculateOverdueFine(dueAt: Date, returnedAt: Date, dailyFineAmount: number) {
  const lateDays = Math.max(0, differenceInCalendarDays(returnedAt, dueAt));
  return {
    lateDays,
    amount: lateDays * dailyFineAmount,
  };
}

export function checkBorrowEligibility(input: BorrowEligibilityInput) {
  if (input.userStatus !== "ACTIVE") {
    return { ok: false, reason: "Member account is not active." };
  }
  if (input.copyStatus !== "AVAILABLE") {
    return { ok: false, reason: "Selected copy is not available." };
  }
  if (input.activeLoans >= input.maxActiveLoans) {
    return { ok: false, reason: "Member has reached the active loan limit." };
  }
  if (input.unpaidFines > input.fineLimit) {
    return { ok: false, reason: "Member has unpaid fines above the configured limit." };
  }
  return { ok: true, reason: "Eligible for borrowing." };
}

export function shouldReserveReturnedCopy(hasActiveReservation: boolean) {
  return hasActiveReservation ? "RESERVED" : "AVAILABLE";
}
