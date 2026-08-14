import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject } from "@/lib/sheets";
import { canEditProject } from "@/lib/projectRules";
import Topbar from "@/components/Topbar";
import ProjectForm from "@/components/ProjectForm";
import StatusBadge from "@/components/StatusBadge";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) notFound();

  if (!canEditProject(project.status)) {
    return (
      <div>
        <Topbar title="แก้ไขโครงการ" subtitle={project.projectName} hideAdd />
        <div className="px-6 py-10 md:px-8 max-w-2xl mx-auto">
          <div className="bg-surface border border-border rounded-2xl p-8 text-center">
            <div className="mb-3 flex justify-center">
              <StatusBadge status={project.status} />
            </div>
            <h2 className="font-display font-semibold text-[17px] mb-2">โครงการนี้เสร็จสิ้นแล้ว</h2>
            <p className="text-[13.5px] text-muted leading-relaxed mb-6">
              โครงการที่มีสถานะ &ldquo;เสร็จสิ้น&rdquo; จะถูกล็อกไว้เพื่อรักษาข้อมูลที่ใช้อ้างอิงไม่ให้ถูกแก้ไขภายหลัง
              หากจำเป็นต้องแก้ไขจริง ๆ กรุณาเปลี่ยนสถานะก่อน
            </p>
            <Link
              href="/projects"
              className="inline-block bg-primary hover:bg-primary-dark text-white text-[13.5px] font-medium px-4 py-2.5 rounded-[9px] transition-colors"
            >
              กลับไปหน้ารายการโครงการ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Topbar title="แก้ไขโครงการ" subtitle={project.projectName} hideAdd />
      <div className="px-6 py-6 md:px-8 max-w-3xl mx-auto">
        <ProjectForm project={project} />
      </div>
    </div>
  );
}
