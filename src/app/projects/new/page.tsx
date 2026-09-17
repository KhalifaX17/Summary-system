import Topbar from "@/components/Topbar";
import ProjectForm from "@/components/ProjectForm";

export default function NewProjectPage() {
  return (
    <div>
      <Topbar title="เพิ่มโครงการใหม่" subtitle="กรอกข้อมูลโครงการให้ครบทุกส่วน" hideAdd />
      <div className="mx-auto max-w-[1120px] px-4 py-7 sm:px-8 md:px-10">
        <div className="mb-6 rounded-2xl border border-primary/15 bg-primary/5 px-5 py-4 sm:px-6">
          <h2 className="font-display text-xl font-semibold text-ink">สร้างโครงการใหม่</h2>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            กรอกข้อมูลที่จำเป็นก่อน แล้วค่อยเติมรายละเอียดผลการดำเนินงานภายหลังได้
            <span className="ml-1 text-red">*</span> คือข้อมูลที่จำเป็น
          </p>
        </div>
        <ProjectForm />
      </div>
    </div>
  );
}
