import { Suspense } from "react";
import { getProjects } from "@/lib/sheets";
import Topbar from "@/components/Topbar";
import ProjectsTable from "@/components/ProjectsTable";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div>
      <Topbar title="รายการโครงการ" subtitle="จัดการข้อมูลโครงการทั้งหมดในระบบ" hideAdd />
      <div className="px-4 py-7 sm:px-8 md:px-10">
        <Suspense fallback={null}>
          <ProjectsTable projects={projects} />
        </Suspense>
      </div>
    </div>
  );
}
