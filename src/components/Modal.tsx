"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";

export default function Modal({
  onClose,
  children,
}: {
  onClose: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-navy-deep/60 backdrop-blur-sm"
        style={{ animation: "modalBackdropIn 0.25s ease-out both" }}
        onClick={onClose}
      />
      <div
        className="relative bg-surface rounded-3xl shadow-2xl max-w-md w-full p-7 md:p-8"
        style={{ animation: "modalPanelIn 0.3s cubic-bezier(0.16,1,0.3,1) both" }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="ปิด"
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-muted hover:bg-paper hover:text-ink transition-colors"
        >
          <svg viewBox="0 0 20 20" fill="none" width="16" height="16">
            <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
        {children}
      </div>

      <style>{`
        @keyframes modalBackdropIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes modalPanelIn {
          from { opacity: 0; transform: translateY(12px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>,
    document.body
  );
}
