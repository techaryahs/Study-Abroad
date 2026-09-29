"use client";

import React, { useEffect, useRef } from "react";
import { AlertTriangle, Info, X } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "primary";
  isLoading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export default function ConfirmModal({
  isOpen,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "primary",
  isLoading = false,
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isLoading) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case "danger":
        return {
          iconBg: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
          btnBg: "bg-rose-600 hover:bg-rose-500 text-white font-bold",
        };
      case "warning":
        return {
          iconBg: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
          btnBg: "bg-amber-500 hover:bg-amber-400 text-black font-bold",
        };
      default:
        return {
          iconBg: "bg-[#c2a878]/10 text-[#c2a878] border border-[#c2a878]/20",
          btnBg: "bg-[#c2a878] hover:bg-[#d4ba8a] text-black font-bold",
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn"
      onClick={() => {
        if (!isLoading) onClose();
      }}
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-[#0d0f12] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-5"
      >
        <div className="flex items-start gap-4">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${styles.iconBg}`}>
            {variant === "danger" || variant === "warning" ? (
              <AlertTriangle size={20} />
            ) : (
              <Info size={20} />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 id="confirm-modal-title" className="text-base font-bold text-white tracking-tight">
              {title}
            </h3>
            <p className="mt-1.5 text-xs text-white/60 leading-relaxed">
              {description}
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-white/40 hover:text-white transition-colors p-1 -mr-1"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/5">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-xs font-semibold text-white/70 hover:text-white border border-white/10 hover:border-white/20 rounded-xl transition-all disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 disabled:opacity-50 ${styles.btnBg}`}
          >
            {isLoading && (
              <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            )}
            <span>{confirmLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
