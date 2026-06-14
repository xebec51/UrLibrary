import { redirectToRoleHome } from "@/lib/authz";

export default async function DashboardPage() {
  await redirectToRoleHome();
}
