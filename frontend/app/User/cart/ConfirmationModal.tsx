"use client";
import { useEffect, useState } from "react";
import { X, AlertTriangle, Loader2 } from "lucide-react";

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    loading?: boolean;
}

export default function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Delete Anyway",
    cancelText = "Nevermind",
    loading = false
}: ConfirmationModalProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 overflow-hidden">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-[#362B25]/40 backdrop-blur-[2px] transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Modal Body */}
            <div 
                className="relative w-full max-w-[400px] bg-[#FFFFFF] border border-[#D4A848]/20 rounded-[2.5rem] p-8 sm:p-10 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 ease-out"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4A848]/5 rounded-full blur-[60px] -mr-16 -mt-16 pointer-events-none" />
                
                <div className="relative z-10 flex flex-col items-center text-center">
                    {/* Warning Icon */}
                    <div className="w-16 h-16 rounded-2xl bg-[#F8F6F1] border border-[#D4A848]/20 flex items-center justify-center mb-6 shadow-inner">
                        <AlertTriangle className="text-[#D4A848] w-8 h-8" />
                    </div>

                    <h2 className="text-2xl font-black tracking-tight text-[#362B25] mb-3 uppercase italic font-serif">Confirm Action</h2>
                    <p className="text-[#675F5B] text-xs font-bold uppercase tracking-widest leading-relaxed mb-10 max-w-[280px] opacity-70">
                        {message}
                    </p>

                    <div className="w-full space-y-3">
                        <button
                            onClick={onConfirm}
                            disabled={loading}
                            className="w-full bg-[#D4A848] hover:bg-[#362B25] text-white py-4 rounded-xl text-xs font-black uppercase tracking-[0.2em] transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 shadow-xl shadow-[#D4A848]/10"
                        >
                            {loading ? <Loader2 size={16} className="animate-spin" /> : confirmText}
                        </button>
                        
                        <button
                            onClick={onClose}
                            className="w-full py-3 text-[#675F5B] hover:text-[#D4A848] text-[10px] font-black uppercase tracking-[0.3em] transition-colors"
                        >
                            {cancelText}
                        </button>
                    </div>
                </div>

                {/* Close Button - Larger Hit Area */}
                <button 
                    onClick={onClose}
                    className="absolute top-2 right-2 p-4 text-[#675F5B]/20 hover:text-[#D4A848] transition-all duration-300 hover:rotate-90 hover:scale-110 z-50 cursor-pointer"
                    aria-label="Close modal"
                >
                    <X size={14} />
                </button>
            </div>
        </div>
    );
}
