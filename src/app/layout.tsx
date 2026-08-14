import type { Metadata } from "next";
import { Kanit, Sarabun } from "next/font/google";
import Navbar from "@/components/Navbar";
import DemoBanner from "@/components/DemoBanner";
import ToastHost from "@/components/Toast";
import "./globals.css";

const kanit = Kanit({
  variable: "--font-kanit",
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600"],
});

const sarabun = Sarabun({
  variable: "--font-sarabun",
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "ระบบสรุปโครงการ สาขา ICT",
  description: "บันทึก ติดตาม และสรุปโครงการของสาขาวิชา ICT",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="th" className={`${kanit.variable} ${sarabun.variable} h-full`}>
      <body className="min-h-full antialiased">
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <DemoBanner />
          <main className="flex-1 min-w-0">{children}</main>
        </div>
        <ToastHost />
      </body>
    </html>
  );
}
