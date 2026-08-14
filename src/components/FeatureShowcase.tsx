"use client";

import { useState } from "react";
import Link from "next/link";
import Modal from "./Modal";
import { IconBudget, IconClock, IconDownload, IconFolder } from "./icons";

interface Feature {
  icon: React.ReactNode;
  title: string;
  desc: string;
  detail: string;
  points: string[];
  ctaHref: string;
  ctaLabel: string;
}

const FEATURES: Feature[] = [
  {
    icon: <IconFolder />,
    title: "รวมข้อมูลไว้ที่เดียว",
    desc: "ไม่ต้องตามหาไฟล์กระจัดกระจาย ทุกโครงการอยู่ใน Google Sheet เดียวกัน",
    detail:
      "ทุกโครงการของสาขาถูกบันทึกลง Google Sheet ชุดเดียวกันโดยอัตโนมัติ ไม่ต้องเปิดไฟล์หลายที่หรือถามหากันว่าใครเก็บไฟล์ไว้ที่ไหน",
    points: ["ค้นหาชื่อโครงการ ผู้รับผิดชอบ หรือหน่วยงานได้ทันที", "กรองตามปีงบประมาณ พันธกิจ หรือสถานะ", "แก้ไข/ลบข้อมูลได้จากหน้าเดียว"],
    ctaHref: "/projects",
    ctaLabel: "ไปที่รายการโครงการ",
  },
  {
    icon: <IconClock />,
    title: "แจ้งเตือนสิ่งที่ต้องติดตาม",
    desc: "เห็นโครงการที่ใกล้ครบกำหนดหรือใช้งบเกินได้ทันทีจากแดชบอร์ด",
    detail:
      "แดชบอร์ดจะคัดกรองโครงการที่ควรเฝ้าระวังให้อัตโนมัติ ไม่ต้องไล่เช็คทีละโครงการเอง",
    points: ["แจ้งเตือนโครงการที่เหลือเวลาน้อยกว่า 14 วัน", "แจ้งเตือนโครงการที่ใช้งบไปแล้วเกิน 90%", "คลิกแล้วไปหน้าแก้ไขโครงการนั้นได้ทันที"],
    ctaHref: "/dashboard",
    ctaLabel: "ไปที่แดชบอร์ด",
  },
  {
    icon: <IconBudget />,
    title: "ติดตามงบประมาณ",
    desc: "เปรียบเทียบงบที่ได้รับกับงบที่ใช้จริงแบบเรียลไทม์ แยกดูรายปีงบประมาณได้",
    detail:
      "ดูภาพรวมการใช้จ่ายงบประมาณของทั้งสาขา หรือสลับดูเฉพาะปีงบประมาณที่สนใจก็ได้ ตัวเลขคำนวณใหม่ให้ทันที",
    points: ["สรุปงบที่ได้รับ ใช้จริง และคงเหลือ", "เลือกดูแยกตามปีงบประมาณได้จากแท็บด้านบนแดชบอร์ด", "แยกสัดส่วนโครงการตามพันธกิจ 5 ด้าน"],
    ctaHref: "/dashboard",
    ctaLabel: "ไปที่แดชบอร์ด",
  },
  {
    icon: <IconDownload />,
    title: "ส่งออกรายงานได้ทันที",
    desc: "ดาวน์โหลดเป็น Excel, PDF หรือ CSV พร้อมใช้งานภายในไม่กี่คลิก",
    detail:
      "เมื่อต้องส่งรายงานให้ผู้บริหารหรือหน่วยงานที่เกี่ยวข้อง กดส่งออกจากหน้ารายการโครงการได้เลย ไม่ต้องพิมพ์ข้อมูลใหม่",
    points: ["Excel (.xlsx) สำหรับทำงานต่อ", "PDF พร้อมพิมพ์หรือนำเสนอ", "CSV สำหรับนำเข้าโปรแกรมอื่น"],
    ctaHref: "/projects",
    ctaLabel: "ไปที่รายการโครงการ",
  },
];

export default function FeatureShowcase() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const active = openIndex !== null ? FEATURES[openIndex] : null;

  return (
    <>
      <section className="relative px-6 pb-16 md:px-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {FEATURES.map((f, i) => (
          <button
            key={f.title}
            type="button"
            onClick={() => setOpenIndex(i)}
            className="animate-fade-up group text-left bg-surface border border-border rounded-2xl p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-gold/40 cursor-pointer active:scale-[0.98] active:translate-y-0"
            style={{ animationDelay: `${0.1 + i * 0.08}s` }}
          >
            <div className="w-9 h-9 rounded-[10px] bg-primary/10 text-primary flex items-center justify-center mb-3.5 transition-colors duration-300 group-hover:bg-gold group-hover:text-white">
              {f.icon}
            </div>
            <h3 className="font-display font-semibold text-[14.5px] mb-1.5">{f.title}</h3>
            <p className="text-[12.5px] text-muted leading-relaxed">{f.desc}</p>
            <span className="inline-block mt-3 text-[12px] font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              ดูเพิ่มเติม →
            </span>
          </button>
        ))}
      </section>

      {active && (
        <Modal onClose={() => setOpenIndex(null)}>
          <div className="w-12 h-12 rounded-[12px] bg-gold/15 text-gold flex items-center justify-center mb-4">
            {active.icon}
          </div>
          <h3 className="font-display font-semibold text-[19px] mb-2.5">{active.title}</h3>
          <p className="text-[13.5px] text-muted leading-relaxed mb-4">{active.detail}</p>
          <ul className="space-y-2 mb-6">
            {active.points.map((p) => (
              <li key={p} className="flex items-start gap-2 text-[13px] text-ink">
                <svg viewBox="0 0 20 20" fill="none" width="16" height="16" className="mt-0.5 shrink-0 text-gold">
                  <circle cx="10" cy="10" r="8.5" stroke="currentColor" />
                  <path d="M6.3 10.3l2.2 2.2 4.8-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {p}
              </li>
            ))}
          </ul>
          <Link
            href={active.ctaHref}
            className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary-dark text-white text-[13.5px] font-medium px-4 py-2.5 rounded-[9px] transition-colors"
          >
            {active.ctaLabel}
          </Link>
        </Modal>
      )}
    </>
  );
}
