import { auth } from "@/auth";
import { getExportRows } from "@/lib/reports";

export const runtime = "nodejs";

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.status !== "ACTIVE" || session.user.role === "MEMBER") {
    return Response.json({ error: "Unauthorized" }, { status: 403 });
  }

  const XLSX = await import("xlsx");
  const workbook = XLSX.utils.book_new();
  const rows = getExportRows();

  XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(rows.books), "Catalog");
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(rows.loans), "Loans");
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(rows.fines), "Fines");

  const data = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" }) as Buffer;
  const body = new ArrayBuffer(data.byteLength);
  new Uint8Array(body).set(data);

  return new Response(body, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": "attachment; filename=\"urlibrary-nexus-report.xlsx\"",
    },
  });
}
