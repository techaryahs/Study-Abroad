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
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-[#2D2926]/40 backdrop-blur-sm"
      />

      {/* Modal Content */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 30 }}
        className="relative w-full max-w-lg bg-white rounded-[32px] overflow-hidden shadow-3xl flex flex-col max-h-[90vh] border border-[rgba(197,160,89,0.15)]"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-6 right-6 text-[#A8A29E] hover:text-[#C5A059] z-10 bg-[#F8F5F0] p-1.5 rounded-full transition-all">
          <X className="w-5 h-5" />
        </button>

        <div className="p-10 flex flex-col gap-8 overflow-y-auto">
          {/* Title */}
          <div className="text-center space-y-2">
            <h2 className="fd text-3xl font-bold text-[#2D2926]">Initiate Cluster</h2>
            <p className="text-[10px] font-bold text-[#A8A29E] uppercase tracking-[0.2em]">Deployment Protocol</p>
          </div>

          {/* Stepper */}
          <div className="flex items-center justify-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step >= 1 ? 'bg-[#C5A059] text-white shadow-lg' : 'bg-[#F8F5F0] text-[#A8A29E]'}`}>1</div>
            <div className={`w-12 h-[1px] ${step >= 2 ? 'bg-[#C5A059]' : 'bg-[#F1EDEA]'}`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step >= 2 ? 'bg-[#C5A059] text-white shadow-lg' : 'bg-[#F8F5F0] text-[#A8A29E]'}`}>2</div>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col gap-6"
              >
                {/* Info Box */}
                <div className="bg-[#F8F5F0] rounded-2xl p-6 border border-[rgba(197,160,89,0.1)]">
                  <ul className="text-[11px] text-[#6B5E51] space-y-4 list-none font-medium leading-relaxed">
                    <li className="flex gap-3">
                      <span className="text-[#C5A059] font-bold">•</span>
                      <span>Capital expenditures are distributed equally across all active cluster members.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-[#C5A059] font-bold">•</span>
                      <span>Should a cluster fail to saturate, assets are immediately recoverable to your digital vault.</span>
                    </li>
                  </ul>
                </div>

                {/* Field Search */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#A8A29E] uppercase tracking-widest ml-1">Academic Discipline</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Identify specific research domain..."
                      value={field}
                      onChange={(e) => {
                          setField(e.target.value);
                          setIsSearching(true);
                      }}
                      className="w-full bg-[#FDFBF7] border border-[#F1EDEA] rounded-xl px-5 py-4 text-xs font-medium focus:outline-none focus:border-[#C5A059] transition-all"
                    />
                    {isSearching && field && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#F1EDEA] rounded-xl shadow-2xl z-20 max-h-48 overflow-y-auto p-1.5">
                        {fields.filter(f => f.toLowerCase().includes(field.toLowerCase())).map((f, i) => (
                          <button 
                            key={i} 
                            onClick={() => { setField(f); setIsSearching(false); }}
                            className="w-full text-left px-4 py-3 text-[11px] font-bold text-[#6B5E51] hover:bg-[#F8F5F0] hover:text-[#C5A059] rounded-lg transition-all mb-0.5"
                          >
                            {f}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#A8A29E] uppercase tracking-widest ml-1">Narrative Abstract</label>
                  <textarea 
                    placeholder="Briefly synthesize your research objectives..."
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-[#FDFBF7] border border-[#F1EDEA] rounded-xl px-5 py-4 text-xs font-medium focus:outline-none focus:border-[#C5A059] transition-all resize-none"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#A8A29E] uppercase tracking-widest ml-1">Collaborative Personnel</label>
                  <select 
                    value={coAuthors}
                    onChange={(e) => setCoAuthors(Number(e.target.value))}
                    className="w-full bg-[#FDFBF7] border border-[#F1EDEA] rounded-xl px-5 py-4 text-xs font-bold text-[#2D2926] focus:outline-none focus:border-[#C5A059] transition-all cursor-pointer appearance-none"
                  >
                    {[1, 2, 3, 4, 5].map((num) => (
                      <option key={num} value={num}>{num} {num === 1 ? 'Research Associate' : 'Research Associates'}</option>
                    ))}
                  </select>
                </div>

                {/* Price Display */}
                <div className="bg-[#2D2926] rounded-[24px] p-8 mt-4 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
                  <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 10% 20%, #C5A059 1px, transparent 1px)", backgroundSize: '20px 20px' }}></div>
                  <p className="text-[11px] text-[#A8A29E] font-medium leading-relaxed relative z-10">
                    Sustained membership valuation: <br /> <span className="text-[#C5A059] font-bold text-sm tracking-tight">INR {(34741.33 / (coAuthors + 1)).toFixed(2)} / Person</span>
                  </p>
                  <button 
                    onClick={() => setStep(2)}
                    className="bg-[#C5A059] hover:bg-white hover:text-[#2D2926] text-white font-bold text-[10px] px-8 py-4 rounded-xl flex items-center gap-2 transition-all uppercase tracking-widest z-10"
                  >
                    Proceed <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col gap-8"
              >
                {/* Price Summary */}
                <div className="bg-[#F8F5F0] p-8 rounded-[32px] border border-[rgba(197,160,89,0.1)]">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#A8A29E] uppercase tracking-widest">Gross Allocation</span>
                      <span className="text-2xl font-bold text-[#2D2926] tracking-tighter">INR 34,741.33</span>
                    </div>

                    <div className="h-[1px] bg-[#F1EDEA]" />

                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-red-500/60 uppercase line-through mb-1">INR 43,426.66</span>
                        <span className="bg-red-500 text-white text-[8px] font-bold px-2 py-0.5 rounded tracking-tighter w-fit">SCHOLARSHIP DISCOUNT (-20%)</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-[#A8A29E] uppercase block mb-1">Net Savings</span>
                        <span className="text-lg font-bold text-emerald-600">INR 8,685.33</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Wallet Card */}
                <div className="bg-[#2D2926] rounded-2xl p-6 flex items-center justify-between shadow-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[rgba(197,160,89,0.1)] flex items-center justify-center border border-[rgba(197,160,89,0.2)]">
                        <Wallet className="w-4 h-4 text-[#C5A059]" />
                    </div>
                    <div className="flex flex-col">
                        <p className="text-[9px] font-bold text-[#A8A29E] uppercase tracking-[0.2em]">Institutional Balance</p>
                        <p className="text-base font-bold text-white tracking-tight">INR 14,500.00</p>
                    </div>
                  </div>
                  <button className="text-[10px] font-bold text-[#C5A059] hover:text-white uppercase tracking-widest bg-white/5 px-4 py-2 rounded-lg transition-all">Sustain Vault</button>
                </div>

                {/* Payment Options */}
                <div className="space-y-4">
                  <p className="text-[10px] text-center text-[#A8A29E] font-bold uppercase tracking-[0.2em]">Transaction Gateway selection</p>
                  <div className="grid grid-cols-2 gap-4">
                      <button className="flex flex-col items-center justify-center p-5 border border-[#F1EDEA] rounded-2xl hover:border-[#C5A059] hover:bg-[#F8F5F0] transition-all group shadow-sm bg-white">
                         <span className="text-[10px] font-bold text-[#6B5E51] opacity-60">RAZORPAY</span>
                      </button>
                      <button className="flex flex-col items-center justify-center p-5 border border-[#F1EDEA] rounded-2xl hover:border-[#C5A059] hover:bg-[#F8F5F0] transition-all group shadow-sm bg-white">
                         <span className="text-[10px] font-bold text-[#6B5E51] opacity-60">AMAZON PAY</span>
                      </button>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                    <button onClick={() => setStep(1)} className="flex-1 bg-[#F8F5F0] text-[#6B5E51] font-bold text-[10px] py-4 rounded-xl uppercase tracking-widest transition-all">Return</button>
                    <button onClick={handleSubmit} disabled={isSubmitting} className="flex-[2] bg-[#2D2926] hover:bg-[#C5A059] text-white font-bold text-[10px] py-4 rounded-xl shadow-2xl uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                        {isSubmitting ? "Processing..." : "Deploy Cluster"} <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Progress dots */}
          <div className="flex justify-center gap-2 pb-2">
            <div className={`w-2 h-2 rounded-full transition-all ${step === 1 ? "bg-[#C5A059] w-4" : "bg-[#F1EDEA]"}`} />
            <div className={`w-2 h-2 rounded-full transition-all ${step === 2 ? "bg-[#C5A059] w-4" : "bg-[#F1EDEA]"}`} />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
