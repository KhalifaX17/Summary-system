import Topbar from "@/components/Topbar";
import ProjectForm from "@/components/ProjectForm";

export default function NewProjectPage() {
  return (
    <div>
      <Topbar title="เพิ่มโครงการใหม่" subtitle="กรอกข้อมูลโครงการให้ครบทุกส่วน" hideAdd />
      <div className="px-6 py-6 md:px-8 max-w-3xl mx-auto">
        <ProjectForm />
      </div>
    </div>
  );
}
