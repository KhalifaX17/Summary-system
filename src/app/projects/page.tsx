import { Suspense } from "react";
import { getProjects } from "@/lib/sheets";
import Topbar from "@/components/Topbar";
import ProjectsTable from "@/components/ProjectsTable";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div>
      <Topbar title="รายการโครงการ" subtitle="ค้นหา แก้ไข หรือลบข้อมูลโครงการ" hideAdd />
      <div className="px-6 py-6 md:px-8">
        <Suspense fallback={null}>
          <ProjectsTable projects={projects} />
        </Suspense>
      </div>
    </div>
  );
}
