"use client";

import React, { useState } from "react";
import { Lock, Sparkles } from "lucide-react";
import CheckoutModal from "@/app/User/cart/checkoutmodal";

interface PremiumLockProps {
  isPremium: boolean;
  children: React.ReactNode;
  title?: string;
  description?: string;
  price?: number;
  discountedPrice?: number;
  isFullPage?: boolean;
}

export default function PremiumLock({
  isPremium,
  children,
  title = "Unlock Premium Insights",
  description = "Get full access to all advanced features, shortlisting tools, and personalized evaluations with our Premium Membership.",
  price = 4999,
  discountedPrice = 1999,
  isFullPage = false
}: PremiumLockProps) {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  if (isPremium) {
    return <>{children}</>;
  }

  return (
    <div className={`relative w-full rounded-[2rem] overflow-hidden ${isFullPage ? 'min-h-screen bg-[#FDFBF7]' : 'bg-white/30'}`}>
      {/* Blurred content underneath */}
      <div 
        className={`select-none pointer-events-none transition-all duration-700 overflow-hidden relative ${isFullPage ? 'max-h-[85vh]' : 'max-h-[450px]'}`}
        style={{ filter: "blur(6px)" }}
      >
        <div className="opacity-60">
          {children}
        </div>
        {/* Soft fade out towards the bottom of the blurred content */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FDFBF7]/50 to-[#FDFBF7] z-0 pointer-events-none" />
      </div>

      {/* The Premium Lock Overlay - Apple Glassmorphism Style */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 bg-gradient-to-t from-[#FDFBF7] via-[#FDFBF7]/90 to-transparent">
        
        <div className="mt-20 relative group/card">
          {/* Subtle glow behind the card */}
          <div className="absolute -inset-1 bg-gradient-to-r from-[#D4A848]/20 to-[#9c782b]/20 rounded-[2.5rem] blur-xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-700" />
          
          <div className="relative bg-white/70 backdrop-blur-2xl border border-white/60 rounded-[2rem] p-10 max-w-md w-full text-center shadow-[0_8px_32px_rgba(0,0,0,0.04)] transform transition-all duration-500 hover:scale-[1.02]">
            
            {/* Elegant Lock Icon */}
            <div className="relative w-16 h-16 mx-auto mb-6 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#D4A848] to-[#F3E5C8] rounded-2xl rotate-3 opacity-20" />
              <div className="relative w-14 h-14 bg-white border border-[#D4A848]/20 rounded-2xl flex items-center justify-center shadow-sm">
                <Lock strokeWidth={1.5} className="w-6 h-6 text-[#D4A848]" />
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-[#2D2926] mb-3 tracking-tight fd">
              {title}
            </h3>
            
            <p className="text-[#6B5E51] text-[14px] leading-relaxed mb-8 font-medium">
              {description}
            </p>
            
            <button
              onClick={() => setIsCheckoutOpen(true)}
              className="w-full bg-[#2D2926] hover:bg-[#D4A848] text-white font-bold text-[13px] tracking-[0.15em] uppercase py-4 px-8 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              Unlock for ₹{discountedPrice}
            </button>
            
            <div className="mt-5 flex items-center justify-center gap-2 text-[10px] text-[#A8A29E] uppercase tracking-widest font-black">
              <span>Lifetime Access</span>
              <span className="w-1 h-1 rounded-full bg-[#D4A848]/50" />
              <span>One-time Payment</span>
            </div>
          </div>
        </div>
      </div>

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={[{ name: "Premium Subscription", price: price }]}
        subtotal={price}
        discount={price - discountedPrice}
        total={discountedPrice}
        currency="INR"
        onSuccess={() => {
          window.dispatchEvent(new Event("premium-upgraded"));
          setIsCheckoutOpen(false);
        }}
      />
    </div>
  );
}
