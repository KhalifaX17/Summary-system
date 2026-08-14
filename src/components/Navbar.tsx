"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "หน้าหลัก", exact: true },
  { href: "/dashboard", label: "แดชบอร์ด", exact: true },
  { href: "/projects", label: "รายการโครงการ", exact: false },
];

function isActive(pathname: string, href: string, exact: boolean): boolean {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(href + "/");
}

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="h-16 shrink-0 bg-surface border-b border-border flex items-center justify-end px-6 md:px-8">
      <nav className="flex items-center gap-1">
        {NAV_ITEMS.map(({ href, label, exact }) => {
          const active = isActive(pathname, href, exact);
          return (
            <Link
              key={href}
              href={href}
              className={`relative px-3.5 py-2 rounded-[8px] text-[13.5px] transition-colors ${
                active ? "text-white" : "text-muted hover:bg-paper hover:text-ink"
              }`}
            >
              {active && (
                <span className="absolute inset-0 rounded-[8px] bg-gradient-to-r from-primary to-[#4d84f5]" />
              )}
              <span className="relative">{label}</span>
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
