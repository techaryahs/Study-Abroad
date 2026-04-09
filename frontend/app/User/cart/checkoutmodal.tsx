"use client";

import React, { useState } from "react";
import { X, AlertCircle } from "lucide-react";

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    subtotal: number;
    discount: number;
    total: number;
    currency: string;
}

export default function CheckoutModal({
    isOpen,
    onClose,
    subtotal,
    discount,
    total,
    currency,
}: CheckoutModalProps) {
    const [useWallet, setUseWallet] = useState(false);
    const walletBalance = 0; // Mocked for now

    if (!isOpen) return null;

    const formatPrice = (price: number) => {
        return price.toLocaleString(currency === "INR" ? "en-IN" : "en-US", {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
        });
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-[#362B25]/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-[#FFFFFF] w-full max-w-sm max-h-[90vh] rounded-[2rem] shadow-2xl overflow-hidden border border-[#D4A848]/20 relative animate-in zoom-in-95 duration-300 flex flex-col">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-[#675F5B]/50 hover:text-[#362B25] transition-colors p-1 z-10"
                >
                    <X size={16} />
                </button>

                <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden p-6 sm:p-8">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-6 mt-1">
                        <div className="flex-1 h-px bg-[#D4A848]/20" />
                        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#362B25]">
                            Secure Checkout
                        </h2>
                        <div className="flex-1 h-px bg-[#D4A848]/20" />
                    </div>

                    {/* Amount Details */}
                    <div className="space-y-3 mb-6 px-1">
                        <div className="flex justify-between items-center text-[11px] gap-4">
                            <span className="font-bold text-[#675F5B] uppercase tracking-wider whitespace-nowrap">Actual Amount:</span>
                            <span className="text-[#675F5B]/70 line-through whitespace-nowrap">
                                {currency} {formatPrice(subtotal)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center gap-4">
                            <span className="text-[11px] font-bold text-[#362B25] uppercase tracking-wider whitespace-nowrap">Amount:</span>
                            <span className="text-[#362B25] font-black text-xl tracking-tighter whitespace-nowrap">
                                {currency} {formatPrice(total)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center text-[11px] gap-4">
                            <span className="font-bold text-[#D4A848] uppercase tracking-wider whitespace-nowrap">You Save:</span>
                            <span className="text-[#D4A848] font-black whitespace-nowrap">
                                {currency} {formatPrice(discount)}
                            </span>
                        </div>
                    </div>

                    {/* Wallet Section */}
                    <div className={`bg-[#F8F6F1] border border-[#D4A848]/10 rounded-2xl p-4 mb-6 group transition-all duration-300 ${useWallet && walletBalance === 0 ? 'border-red-500/30' : 'hover:border-[#D4A848]/30'}`}>
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="use-wallet"
                                checked={useWallet}
                                onChange={(e) => setUseWallet(e.target.checked)}
                                className="w-4 h-4 rounded border-[#D4A848]/40 text-[#D4A848] focus:ring-[#D4A848] cursor-pointer"
                            />
                            <label htmlFor="use-wallet" className="flex-1 cursor-pointer">
                                <p className="text-[10px] font-black text-[#362B25] uppercase tracking-widest leading-none">
                                    Wallet Balance: <span className="text-[#D4A848]">USD 0.00</span>
                                </p>
                                <p className="text-[9px] text-[#675F5B] mt-1 font-bold italic opacity-60">
                                    Use wallet amount?
                                </p>
                            </label>
                        </div>
                        {useWallet && walletBalance === 0 && (
                            <p className="text-[8px] text-red-500 font-extrabold uppercase tracking-tighter mt-3 flex items-center gap-1.5 animate-in slide-in-from-top-1 duration-200">
                                <AlertCircle size={10} className="shrink-0" />
                                Please add balance first
                            </p>
                        )}
                    </div>

                    {/* Payment Button */}
                    <div className="mb-4">
                        <button className="w-full bg-[#362B25] hover:bg-[#2A221D] text-[#FFFFFF] py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-lg hover:shadow-[#362B25]/20 hover:-translate-y-0.5 active:scale-95">
                            Buy with RazorPay
                        </button>
                    </div>

                    <p className="text-center text-[8px] text-[#675F5B]/60 font-black uppercase tracking-widest mb-6 px-4">
                        EMI Available • RazorPay applies 5% processing fee                    </p>

                    {/* Bottom Note */}
                    <div className="pt-5 border-t border-[#D4A848]/10 text-center">
                        <a href="/User/wallet" className="text-[9px] text-[#D4A848] hover:text-[#362B25] transition-colors flex items-center justify-center gap-1 font-black uppercase tracking-widest mb-2">
                            Add Funds to Wallet <span className="text-xs">→</span>
                        </a>
                        <p className="text-[8px] text-[#675F5B]/50 leading-tight font-bold uppercase tracking-widest px-2 max-w-[280px] mx-auto">
                            Collect funds in wallet for collective service purchase
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
