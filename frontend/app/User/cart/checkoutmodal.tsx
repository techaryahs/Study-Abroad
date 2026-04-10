"use client";

import React, { useState } from "react";
import Link from "next/link";
import { X, Loader2, ChevronRight } from "lucide-react";

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    items: any[];
    subtotal: number;
    discount: number;
    total: number;
    currency: string;
    onSuccess?: () => void;
}

export default function CheckoutModal({
    isOpen,
    onClose,
    items,
    subtotal,
    discount,
    total,
    currency,
    onSuccess,
}: CheckoutModalProps) {
    const [isProcessing, setIsProcessing] = useState(false);

    const handlePayment = () => {
        setIsProcessing(true);
        // Simulate payment gateway delay
        setTimeout(() => {
            setIsProcessing(false);
            if (onSuccess) onSuccess();
            onClose();
        }, 2000);
    };

    if (!isOpen) return null;

    const formatPrice = (price: number) => {
        return price.toLocaleString(currency === "INR" ? "en-IN" : "en-US", {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
        });
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px] animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-[480px] rounded-xl shadow-2xl relative animate-in zoom-in-95 duration-300 font-sans flex flex-col">
                
                {/* Header with horizontal lines */}
                <div className="pt-8 px-8 pb-6 relative">
                    <div className="flex items-center justify-center gap-4">
                        <div className="h-[1px] bg-black/20 flex-1"></div>
                        <h2 className="text-[14px] font-black uppercase tracking-[0.15em] text-[#362B25]">Your Payment</h2>
                        <div className="h-[1px] bg-black/20 flex-1"></div>
                    </div>
                    
                    {/* Close Area */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 text-black/40 hover:text-black transition-all"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Content */}
                <div className="px-10 pb-8">
                    {/* Detailed Pricing Rows */}
                    <div className="space-y-5 mb-8">
                        <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest text-[#362B25]">
                             <span className="opacity-80">Actual Amount:</span>
                             <span className="text-[#675F5B]/50 line-through">{currency} {formatPrice(subtotal)}</span>
                        </div>
                        <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest text-[#362B25]">
                             <span className="opacity-80">Amount:</span>
                             <span className="text-red-600">{currency} {formatPrice(total)}</span>
                        </div>
                        <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest text-[#675F5B]/50">
                             <span>You Save:</span>
                             <span>{currency} {formatPrice(discount)}</span>
                        </div>
                    </div>

                    {/* Razorpay Action Only */}
                    <div className="text-center mb-4">
                        <button 
                            disabled={isProcessing}
                            onClick={handlePayment}
                            className="w-full bg-[#302621] text-white py-4 rounded-3xl font-black text-[11px] uppercase tracking-widest transition-all hover:bg-[#251d1a] shadow-lg active:scale-95 flex items-center justify-center h-[52px]"
                        >
                            {isProcessing ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                "Buy Now with RazorPay"
                            )}
                        </button>

                        <p className="text-[9px] text-[#675F5B] font-bold uppercase tracking-widest mt-4 opacity-70">
                            EMI Available. RazorPay applies 5% processing fee
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
