"use client";

import Modal from "./Modal";

export default function ConfirmDialog({
  title,
  description,
  confirmLabel = "ยืนยัน",
  cancelLabel = "ยกเลิก",
  danger,
  loading,
  onConfirm,
  onClose,
}: {
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <Modal onClose={onClose}>
      <div
        className={`w-11 h-11 rounded-[12px] flex items-center justify-center mb-4 ${
          danger ? "bg-red/10 text-red" : "bg-primary/10 text-primary"
        }`}
      >
        <svg viewBox="0 0 20 20" fill="none" width="20" height="20">
          <path
            d="M10 3.3 17.3 15.7a1 1 0 0 1-.86 1.5H3.56a1 1 0 0 1-.86-1.5L10 3.3Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path d="M10 8.3v3.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="10" cy="14.1" r="0.9" fill="currentColor" />
        </svg>
      </div>
      <h3 className="font-display font-semibold text-[17px] mb-2">{title}</h3>
      <p className="text-[13.5px] text-muted leading-relaxed mb-6">{description}</p>
      <div className="flex justify-end gap-2.5">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2.5 rounded-[9px] border border-border text-[13.5px] hover:bg-paper transition-all active:scale-[0.97]"
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={loading}
          className={`px-4 py-2.5 rounded-[9px] text-white text-[13.5px] font-medium transition-all active:scale-[0.97] disabled:opacity-60 ${
            danger ? "bg-red hover:bg-[#c23c26]" : "bg-primary hover:bg-primary-dark"
          }`}
        >
          {loading ? "กำลังดำเนินการ..." : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
