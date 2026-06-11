import { Badge } from "@/components/ui/badge";

const toneByStatus: Record<string, "neutral" | "primary" | "success" | "warning" | "danger" | "accent"> = {
  ACTIVE: "success",
  AVAILABLE: "success",
  RETURNED: "success",
  PAID: "success",
  BORROWED: "primary",
  RESERVED: "accent",
  READY_FOR_PICKUP: "accent",
  PENDING: "warning",
  OVERDUE: "danger",
  LOST: "danger",
  UNPAID: "danger",
  WAIVED: "neutral",
  CANCELLED: "neutral",
  EXPIRED: "neutral",
  INACTIVE: "neutral",
  SUSPENDED: "danger",
};

export function StatusPill({ status }: { status: string }) {
  const tone = toneByStatus[status] ?? "neutral";
  return <Badge tone={tone}>{status.replaceAll("_", " ")}</Badge>;
}
