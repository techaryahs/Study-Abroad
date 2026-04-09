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
                className="relative w-full max-w-[320px] bg-[#FFFFFF] border border-[#D4A848]/20 rounded-[2rem] p-6 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 ease-out"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#D4A848]/5 rounded-full blur-[40px] -mr-12 -mt-12 pointer-events-none" />
                
                <div className="relative z-10 flex flex-col items-center text-center">
                    {/* Warning Icon - Smaller */}
                    <div className="w-12 h-12 rounded-xl bg-[#F8F6F1] border border-[#D4A848]/20 flex items-center justify-center mb-4">
                        <AlertTriangle className="text-[#D4A848] w-6 h-6" />
                    </div>

                    <h2 className="text-xl font-black tracking-tight text-[#362B25] mb-2">{title}</h2>
                    <p className="text-[#675F5B] text-[10px] font-bold uppercase tracking-widest leading-relaxed mb-8 max-w-[240px]">
                        {message}
                    </p>

                    <div className="w-full space-y-2">
                        <button
                            onClick={onConfirm}
                            disabled={loading}
                            className="w-full bg-[#D4A848] hover:bg-[#c6a96b] text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 size={12} className="animate-spin text-white" /> : confirmText}
                        </button>
                        
                        <button
                            onClick={onClose}
                            className="w-full py-2 text-[#675F5B] hover:text-[#362B25] text-[9px] font-black uppercase tracking-[0.2em] transition-colors"
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
