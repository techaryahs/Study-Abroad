"use client";

import React, { useState, useEffect } from "react";
import { X, ChevronRight, Search, Wallet, CreditCard, CheckCircle, Info, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getToken } from "@/app/lib/token";
import { useRouter } from "next/navigation";

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialStep?: number;
}

export default function CreateGroupModal({ isOpen, onClose, initialStep = 1 }: CreateGroupModalProps) {
  const [step, setStep] = useState(initialStep);
  const [field, setField] = useState("");
  const [description, setDescription] = useState("");
  const [coAuthors, setCoAuthors] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!field || !description) {
      alert("Please fill all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'}/api/research-groups/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getToken()}`
        },
        body: JSON.stringify({
          topic: field,
          description,
          maxAuthors: coAuthors
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert("Research Group Created Successfully!");
        onClose();
        window.location.reload(); // Refresh to show new group
      } else {
        alert(data.error || "Failed to create group");
      }
    } catch (err) {
      console.error("Error creating group:", err);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setStep(initialStep);
    }
  }, [isOpen, initialStep]);

  const fields = [
    "Chemistry", "Environmental Science", "Exercise Sci/Kinesiology", 
    "Fisheries and Wildlife", "Food Science", "Forest Management", 
    "Marine Science", "Physicians Assistant", "Apparel/Textile Design", "Film/Broadcast"
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60"
      />

      {/* Modal Content */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-lg bg-white text-black rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-black/40 hover:text-black z-10">
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 flex flex-col gap-6 overflow-y-auto">
          {/* Title */}
          <h2 className="text-center font-black text-lg tracking-widest text-[#444] uppercase">Create a Group</h2>

          {/* Stepper */}
          <div className="flex items-center justify-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step >= 1 ? 'bg-[#c2a878] text-white' : 'bg-gray-100 text-gray-400'}`}>1</div>
            <div className={`w-16 h-px ${step >= 2 ? 'bg-[#c2a878]' : 'bg-gray-200'}`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step >= 2 ? 'bg-[#c2a878] text-white' : 'bg-gray-100 text-gray-400'}`}>2</div>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col gap-5"
              >
                {/* Info Box */}
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <ul className="text-[11px] text-gray-500 space-y-3 list-disc pl-4 leading-relaxed font-medium">
                    <li>You are paying your share of the overall cost, which will be equally shared among the Group members.</li>
                    <li>If the Group&apos;s membership remains incomplete, you can leave it and the amount you paid will be transferred to your Wallet, from where you can make other purchases.</li>
                    <li>Do check out our complete list of services geared to facilitate your travel abroad plans!</li>
                  </ul>
                </div>

                {/* Field Search */}
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Select Your Interested Area of Research"
                    value={field}
                    onChange={(e) => {
                        setField(e.target.value);
                        setIsSearching(true);
                    }}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-xs focus:outline-none focus:border-[#c2a878] transition-colors"
                  />
                  {isSearching && field && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-gray-100 rounded-b-lg shadow-xl z-20 max-h-48 overflow-y-auto">
                      {fields.filter(f => f.toLowerCase().includes(field.toLowerCase())).map((f, i) => (
                        <button 
                          key={i} 
                          onClick={() => { setField(f); setIsSearching(false); }}
                          className="w-full text-left px-4 py-2 text-[11px] hover:bg-gray-50 border-b border-gray-50 last:border-0"
                        >
                          • {f}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Description */}
                <textarea 
                  placeholder="Description"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-xs focus:outline-none focus:border-[#c2a878] transition-colors resize-none"
                />
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Number of Co-authors (Max 5)</label>
                  <select 
                    value={coAuthors}
                    onChange={(e) => setCoAuthors(Number(e.target.value))}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-[11px] font-medium text-gray-600 focus:outline-none focus:border-[#c2a878] transition-all cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5].map((num) => (
                      <option key={num} value={num}>{num} {num === 1 ? 'co-author' : 'co-authors'}</option>
                    ))}
                  </select>
                </div>

                {/* Price Display */}
                <div className="bg-gray-50/50 rounded-xl p-5 border border-dashed border-gray-200 flex items-center justify-between">
                  <p className="text-[11px] text-gray-500 font-medium">
                    Both you and your {coAuthors} co-authors will <br /> pay <span className="text-green-600 font-bold tracking-tight">INR {(34741.33 / (coAuthors + 1)).toFixed(2)}</span>
                  </p>
                  <button 
                    onClick={() => setStep(2)}
                    className="bg-[#c2a878] hover:bg-[#d4af37] text-black font-black text-[11px] px-6 py-3 rounded-lg flex items-center gap-2 transition-all shadow-lg active:scale-95 uppercase"
                  >
                    Let&apos;s go <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col gap-6"
              >
                {/* Price Summary */}
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-black text-gray-800">Amount:</span>
                    <div className="flex items-center gap-3">
                         <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded px-2 py-1">
                            <span className="text-[10px] font-bold text-gray-400">INR</span>
                            <ChevronRight className="w-3 h-3 text-gray-400 rotate-90" />
                         </div>
                         <span className="text-xl font-black text-green-600 tracking-tight">INR 34,741.33</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-dashed border-gray-100 pt-3">
                    <span className="text-[11px] font-bold text-gray-300 line-through">INR 43,426.66</span>
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">You Save:</span>
                        <span className="bg-red-500 text-white text-[9px] font-black px-2 py-0.5 rounded uppercase">20% OFF</span>
                        <span className="text-[13px] font-black text-green-600">INR 8,685.33</span>
                    </div>
                  </div>
                </div>

                {/* Wallet Card */}
                <div className="bg-gray-50/80 rounded-2xl p-5 border border-gray-100 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#c2a878]/10 flex items-center justify-center border border-[#c2a878]/20">
                        <Wallet className="w-4 h-4 text-[#c2a878]" />
                    </div>
                    <div className="flex flex-col">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Your Balance</p>
                        <p className="text-base font-black text-gray-900 tracking-tight">INR 14,500.00</p>
                    </div>
                  </div>
                  <button className="text-[10px] font-black text-[#c2a878] hover:text-[#d4af37] uppercase tracking-tighter border-b border-[#c2a878]/30 hover:border-[#d4af37]">Add Funds</button>
                </div>

                <p className="text-[10px] text-center text-gray-300 font-bold uppercase tracking-widest">Do you want to use your wallet amount?</p>

                {/* Payment Options */}
                <div className="grid grid-cols-2 gap-3">
                    <button className="flex flex-col items-center justify-center gap-2 p-4 border border-gray-100 rounded-xl hover:border-[#c2a878]/30 hover:bg-gray-50/50 transition-all group">
                        <div className="w-16 h-6 bg-gray-100 rounded flex items-center justify-center">
                            <span className="text-[8px] font-black text-blue-600 italic tracking-tighter">Razorpay</span>
                        </div>
                    </button>
                    <button className="flex flex-col items-center justify-center gap-2 p-4 border border-gray-100 rounded-xl hover:border-[#c2a878]/30 hover:bg-gray-50/50 transition-all group">
                        <div className="w-16 h-6 bg-gray-100 rounded flex items-center justify-center">
                            <span className="text-[8px] font-black text-yellow-600 tracking-tighter">Amazon Pay</span>
                        </div>
                    </button>
                </div>

                <div className="flex flex-col gap-1.5 opacity-60">
                    <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold">
                        <Info className="w-3 h-3" /> Stripe will apply 5% processing fee
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold">
                        <Info className="w-3 h-3" /> RazorPay will apply 5% processing fee
                    </div>
                </div>

                <div className="flex gap-3 mt-2">
                    <button onClick={() => setStep(1)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-xs py-3 rounded-lg transition-all">Back</button>
                    <button onClick={handleSubmit} disabled={isSubmitting} className="flex-[2] bg-[#c2a878] hover:bg-[#d4af37] text-black font-black text-[11px] py-3 rounded-lg shadow-xl uppercase transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                        {isSubmitting ? "Creating..." : "Create Group & Pay"} <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Progress dots */}
          <div className="flex justify-center gap-1.5 pt-2">
            <div className={`w-1.5 h-1.5 rounded-full transition-colors ${step === 1 ? "bg-[#c2a878]" : "bg-gray-200"}`} />
            <div className={`w-1.5 h-1.5 rounded-full transition-colors ${step === 2 ? "bg-[#c2a878]" : "bg-gray-200"}`} />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
