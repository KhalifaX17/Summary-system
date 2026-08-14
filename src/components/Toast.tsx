"use client";

import { useEffect, useState } from "react";

export interface ToastMessage {
  id: number;
  text: string;
  variant: "success" | "error";
}

let idCounter = 0;
const listeners = new Set<(msg: ToastMessage) => void>();

export function showToast(text: string, variant: "success" | "error" = "success") {
  const msg: ToastMessage = { id: ++idCounter, text, variant };
  listeners.forEach((fn) => fn(msg));
}

export default function ToastHost() {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  useEffect(() => {
    function onMessage(msg: ToastMessage) {
      setMessages((prev) => [...prev, msg]);
      setTimeout(() => {
        setMessages((prev) => prev.filter((m) => m.id !== msg.id));
      }, 3200);
    }
    listeners.add(onMessage);
    return () => {
      listeners.delete(onMessage);
    };
  }, []);

  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2.5 items-end pointer-events-none">
      {messages.map((m) => (
        <div
          key={m.id}
          className={`pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-[10px] shadow-lg text-[13.5px] font-medium text-white ${
            m.variant === "success" ? "bg-navy" : "bg-red"
          }`}
          style={{ animation: "toastIn 0.35s cubic-bezier(0.16,1,0.3,1) both" }}
        >
          {m.variant === "success" ? (
            <svg viewBox="0 0 20 20" fill="none" width="16" height="16" className="shrink-0 text-green">
              <circle cx="10" cy="10" r="8.5" fill="currentColor" fillOpacity="0.2" />
              <path d="M6.3 10.3l2.2 2.2 4.8-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg viewBox="0 0 20 20" fill="none" width="16" height="16" className="shrink-0 text-[#ffb4a8]">
              <circle cx="10" cy="10" r="8.5" stroke="currentColor" strokeWidth="1.4" />
              <path d="M10 6.3v4.2M10 13.1h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          )}
          {m.text}
        </div>
      ))}
      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateY(10px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
