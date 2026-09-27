import type { Metadata } from "next";
import { Kanit, Sarabun } from "next/font/google";
import Navbar from "@/components/Navbar";
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
  title: "ระบบจัดการโครงการ",
  description: "บันทึก ติดตาม และสรุปโครงการของสาขาวิชา ICT",
};

const themeInit = `
  (() => {
    try {
      const savedTheme = localStorage.getItem("summary-theme");
      const validThemes = ["sunset", "midnight", "forest", "rose"];
      const nextTheme = validThemes.includes(savedTheme || "") ? savedTheme : "sunset";
      document.documentElement.dataset.theme = nextTheme;
    } catch (error) {
      document.documentElement.dataset.theme = "sunset";
    }
  })();
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="th" suppressHydrationWarning className={`${kanit.variable} ${sarabun.variable} h-full`}>
      <body className="min-h-full antialiased">
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1 min-w-0">{children}</main>
        </div>
        <ToastHost />
      </body>
    </html>
  );
}
