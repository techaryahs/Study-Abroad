"use client";

import { useState } from "react";
import pricingData from "@/data/services-pricing.json";
import { ShieldCheck, Star } from "lucide-react";

type ServiceId = keyof typeof pricingData;

export default function AddToCart({ serviceId }: { serviceId: string }) {
    const [currency, setCurrency] = useState<"INR" | "USD">("INR");
    const [sessions, setSessions] = useState(1);
    
    const data = (pricingData as any)[serviceId];

    if (!data) return <div className="p-8 rounded-2xl bg-dark-900/30 border border-white/[0.04] text-white/50 text-sm text-center">Pricing not found</div>;

    if (data.type === "variable") {
        const pricePerSession = data.pricing[currency].pricePerSession;
        const symbol = data.pricing[currency].symbol;
        const totalPrice = sessions * pricePerSession;

        return (
            <div className="p-6 rounded-[2.5rem] bg-dark-950 border border-white/[0.08] shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden group">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-base font-black uppercase tracking-widest">Start Training</h3>
                    <Star className="text-gold-500 w-4 h-4 fill-gold-500" />
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-white/[0.05]">
                        <span className="text-[10px] text-white/40 font-black uppercase tracking-widest">Pricing</span>
                        <select
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value as "INR" | "USD")}
                            className="bg-transparent text-gold-500 text-[10px] font-black uppercase outline-none cursor-pointer"
                        >
                            <option value="INR" className="bg-dark-950">INR</option>
                            <option value="USD" className="bg-dark-950">USD</option>
                        </select>
                    </div>

                    <div className="flex justify-between items-center py-3 border-b border-white/[0.05]">
                        <span className="text-[10px] text-white/40 font-black uppercase tracking-widest">Sessions</span>
                        <div className="flex items-center gap-4">
                            <button onClick={() => setSessions(Math.max(1, sessions - 1))} className="text-sm font-black hover:text-gold-500 transition-colors">-</button>
                            <span className="text-xs font-black">{sessions}</span>
                            <button onClick={() => setSessions(sessions + 1)} className="text-sm font-black hover:text-gold-500 transition-colors">+</button>
                        </div>
                    </div>

                    <div className="pt-4">
                        <div className="flex justify-between items-end mb-6">
                            <span className="text-[9px] text-white/20 font-black uppercase tracking-[0.2em]">Total</span>
                            <span className="text-3xl font-black bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent leading-none tracking-tighter">
                                {symbol}{totalPrice.toLocaleString()}
                            </span>
                        </div>

                        <div className="grid gap-3">
                            <button className="bg-gold-500 hover:bg-gold-400 text-black py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl transition-all active:scale-95 text-center">
                                Buy Now
                            </button>
                            <button className="border border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-black py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 text-center">
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/[0.05] text-center">
                    <p className="text-[8px] text-white/20 font-black uppercase tracking-[0.3em] flex items-center justify-center gap-2">
                        <ShieldCheck size={10} /> Secure Checkout
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 rounded-2xl bg-dark-900/30 border border-white/[0.04] shadow-2xl relative transition-all duration-300">
            <h3 className="text-xl font-bold mb-8 text-center text-white/90">Start Now</h3>
            
            <div className="space-y-5">
                <div className="flex justify-between items-start gap-4">
                    <span className="font-bold text-white/90 text-sm">Services:</span>
                    <span className="text-white/70 text-sm text-right">{data.title}</span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="font-bold text-white/90 text-sm">Duration:</span>
                    <span className="text-white/70 text-sm flex items-center gap-1.5">
                        {data.duration}
                        <div className="w-3.5 h-3.5 rounded-full border border-blue-400 text-blue-400 flex items-center justify-center text-[10px] font-bold cursor-help" title="Estimated timeline">i</div>
                    </span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="font-bold text-white/90 text-sm">Currency:</span>
                    <select 
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value as "INR" | "USD")}
                        className="bg-dark-950 text-white/80 border border-white/20 rounded px-3 py-1.5 outline-none text-sm w-32 focus:border-gold-500 transition-colors cursor-pointer"
                    >
                        <option value="INR">INR</option>
                        <option value="USD">USD</option>
                    </select>
                </div>

                <div className="flex justify-between items-center pt-3 mt-1 border-t border-white/5">
                    <span className="font-bold text-white/90 text-sm">Actual Amount:</span>
                    <span className="text-white/40 line-through text-sm">
                        {currency} {data.pricing[currency].actual}
                    </span>
                </div>
                
                <div className="flex justify-between items-center">
                    <span className="font-bold text-white/90 text-sm">Amount:</span>
                    <span className="text-red-500 font-bold text-lg">
                        {currency} {data.pricing[currency].discounted}
                    </span>
                </div>
                
                <div className="flex justify-between items-center">
                    <span className="font-bold text-white/90 text-sm">You save:</span>
                    <div className="flex items-center gap-3">
                        <span className="text-white/60 text-sm">
                            {currency} {data.pricing[currency].save}
                        </span>
                        <span className="bg-[#b35e2b] text-white px-2 py-0.5 rounded text-xs font-medium">
                            {data.pricing[currency].off}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-6">
                    <button className="border border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-black py-3 rounded-lg text-sm font-bold transition-all duration-300 active:scale-95 text-center">
                        Add to Cart
                    </button>
                    <button className="bg-gold-500 text-black hover:bg-gold-400 py-3 rounded-lg text-sm font-bold transition-all duration-300 active:scale-95 text-center">
                        Buy Now
                    </button>
                </div>
            </div>
        </div>
    );
}
