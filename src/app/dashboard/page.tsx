import { getProjects } from "@/lib/sheets";
import DashboardContent from "@/components/DashboardContent";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const projects = await getProjects();
  return <DashboardContent projects={projects} />;
}
