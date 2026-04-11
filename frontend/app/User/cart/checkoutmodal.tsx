"use client";

import React, { useState } from "react";
import { X, AlertCircle } from "lucide-react";

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    items: any[];
    subtotal: number;
    discount: number;
    total: number;
    currency: string;
}

export default function CheckoutModal({
    isOpen,
    onClose,
    items,
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
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-[#362B25]/80 backdrop-blur-md animate-in fade-in duration-500">
            <div className="bg-[#FFFFFF] w-full max-w-5xl max-h-[90vh] md:h-auto rounded-[2.5rem] shadow-2xl overflow-hidden border border-[#D4A848]/20 relative animate-in zoom-in-95 duration-500 flex flex-col md:flex-row">
                
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-[#675F5B]/30 hover:text-[#362B25] transition-all hover:rotate-90 p-2 z-50 bg-[#F8F6F1] rounded-full sm:bg-transparent"
                >
                    <X size={20} />
                </button>

                {/* Left: Order Review (md: column) */}
                <div className="flex-1 bg-[#F8F6F1]/50 p-6 sm:p-12 overflow-y-auto border-b md:border-b-0 md:border-r border-[#D4A848]/10 max-h-[300px] md:max-h-[600px]">
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="w-10 h-0.5 bg-[#D4A848]/30"></span>
                            <span className="text-[10px] font-black text-[#D4A848] uppercase tracking-[0.4em]">Review</span>
                        </div>
                        <h2 className="text-3xl font-black text-[#362B25] tracking-tight italic font-serif uppercase leading-none">Your <br/> Selection</h2>
                    </div>

                    <div className="space-y-4">
                        {items.map((item, idx) => (
                            <div key={idx} className="flex gap-4 p-4 bg-white rounded-2xl border border-[#D4A848]/10 group hover:shadow-lg transition-all">
                                <div className="w-12 h-12 rounded-xl bg-[#F8F6F1] flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">
                                    {item.serviceId.includes('visa') ? '🛂' : item.serviceId.includes('research') ? '📄' : '🎓'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-xs font-black text-[#362B25] uppercase tracking-tight line-clamp-1 truncate">{item.title}</h4>
                                    <div className="flex justify-between items-end mt-1">
                                        <p className="text-[10px] text-[#D4A848] font-black uppercase tracking-widest">{item.duration}</p>
                                        <p className="text-xs font-black text-[#362B25]">{currency} {formatPrice(item.price)}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 pt-6 border-t border-[#D4A848]/10">
                        <p className="text-[10px] font-bold text-[#675F5B] uppercase tracking-[0.2em]">Total Items: <span className="text-[#362B25] font-black">{items.length}</span></p>
                    </div>
                </div>

                {/* Right: Payment & Summary (md: column) */}
                <div className="w-full md:w-[400px] p-6 sm:p-12 relative flex flex-col justify-center bg-white">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-[#D4A848]/5 rounded-full blur-[80px] pointer-events-none" />

                    <div className="mb-8 relative z-10">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#D4A848] mb-8 text-center border-b border-[#D4A848]/10 pb-4">
                            Summary & Payment
                        </h2>
                        
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-xs">
                                <span className="font-bold text-[#675F5B] uppercase tracking-widest opacity-60">Subtotal</span>
                                <span className="text-[#675F5B]/70 line-through font-bold">
                                    {currency} {formatPrice(subtotal)}
                                </span>
                            </div>
                            
                            <div className="flex justify-between items-center text-xs">
                                <span className="font-black text-[#D4A848] uppercase tracking-widest">Savings</span>
                                <span className="text-[#D4A848] font-black">
                                    - {currency} {formatPrice(discount)}
                                </span>
                            </div>

                            <div className="bg-[#40332D] text-white p-6 rounded-3xl shadow-xl mt-6 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-[#D4A848]/10 group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
                                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#D4A848]">Total Payable</span>
                                <div className="flex justify-between items-baseline mt-1">
                                    <p className="text-3xl font-black tracking-tighter">
                                        {currency} {formatPrice(total)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Wallet Section */}
                    <div className={`bg-[#F8F6F1] border-2 border-dashed border-[#D4A848]/20 rounded-2xl p-4 mb-8 relative z-10 transition-all ${useWallet && walletBalance === 0 ? 'border-red-500/30 bg-red-50/10' : ''}`}>
                        <div className="flex items-center gap-4">
                            <div className="relative flex items-center">
                                <input
                                    type="checkbox"
                                    id="use-wallet"
                                    checked={useWallet}
                                    onChange={(e) => setUseWallet(e.target.checked)}
                                    className="peer w-5 h-5 rounded border-[#D4A848]/40 text-[#D4A848] focus:ring-[#D4A848] cursor-pointer appearance-none bg-white border-2"
                                />
                                <div className="absolute opacity-0 peer-checked:opacity-100 pointer-events-none left-1 text-[#D4A848] font-bold text-xs flex items-center justify-center">✓</div>
                            </div>
                            <label htmlFor="use-wallet" className="flex-1 cursor-pointer">
                                <p className="text-[10px] font-black text-[#362B25] uppercase tracking-widest leading-none">
                                    Apply Wallet Balance
                                </p>
                                <p className="text-[9px] text-[#D4A848] mt-1 font-black">
                                    Balance: USD 0.00
                                </p>
                            </label>
                        </div>
                    </div>

                    <button className="relative z-10 w-full bg-[#D4A848] hover:bg-[#362B25] text-[#FFFFFF] py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all shadow-2xl shadow-[#D4A848]/10 active:scale-95 group overflow-hidden">
                        <span className="relative z-10">Pay & Finalize</span>
                        <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20 transform translate-y-full group-hover:translate-y-0 transition-transform" />
                    </button>

                    <div className="mt-8 text-center relative z-10">
                        <div className="flex justify-center gap-4 opacity-30 grayscale hover:grayscale-0 transition-all">
                           <span className="text-[8px] font-black">VISA</span>
                           <span className="text-[8px] font-black">RAZORPAY</span>
                           <span className="text-[8px] font-black">STRIPE</span>
                        </div>
                        <p className="text-[8px] text-[#675F5B]/40 font-black uppercase tracking-widest mt-4">
                            SECURE 256-BIT SSL ENCRYPTED TRANSACTION
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
