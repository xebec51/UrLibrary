import { fines } from "@/lib/seed-data";

export function summarizeFines(records = fines) {
  const unpaid = records.filter((fine) => fine.status === "UNPAID");
  const paid = records.filter((fine) => fine.status === "PAID");
  const waived = records.filter((fine) => fine.status === "WAIVED");
  return {
    unpaidCount: unpaid.length,
    unpaidAmount: unpaid.reduce((total, fine) => total + fine.amount, 0),
    paidAmount: paid.reduce((total, fine) => total + fine.amount, 0),
    waivedAmount: waived.reduce((total, fine) => total + fine.amount, 0),
  };
}

export function fineStatusAfterPayment(markAsPaid: boolean) {
  return markAsPaid ? "PAID" : "WAIVED";
}
