'use client';

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, FileText, ArrowRight, ArrowLeft, Trophy } from 'lucide-react';

interface TestField {
  name: string;
  label: string;
  min: number;
  max: number;
  step?: number;
}

interface TestType {
  id: string;
  name: string;
  fields: TestField[];
}

const TESTS: TestType[] = [
  {
    id: "toefl", name: "TOEFL", fields: [
      { name: "reading", label: "Reading", min: 0, max: 30 },
      { name: "speaking", label: "Speaking", min: 0, max: 30 },
      { name: "listening", label: "Listening", min: 0, max: 30 },
      { name: "writing", label: "Writing", min: 0, max: 30 },
    ]
  },
  {
    id: "ielts", name: "IELTS", fields: [
      { name: "reading", label: "Reading", min: 0, max: 9, step: 0.5 },
      { name: "speaking", label: "Speaking", min: 0, max: 9, step: 0.5 },
      { name: "listening", label: "Listening", min: 0, max: 9, step: 0.5 },
      { name: "writing", label: "Writing", min: 0, max: 9, step: 0.5 },
    ]
  },
  {
    id: "gre", name: "GRE", fields: [
      { name: "verbal", label: "Verbal", min: 130, max: 170 },
      { name: "quantitative", label: "Quantitative", min: 130, max: 170 },
      { name: "writing", label: "Analytical Writing", min: 0, max: 6, step: 0.5 },
    ]
  },
  {
    id: "gmat", name: "GMAT", fields: [
      { name: "verbal", label: "Verbal", min: 0, max: 60 },
      { name: "quantitative", label: "Quantitative", min: 0, max: 60 },
      { name: "reasoning", label: "Integrated Reasoning", min: 1, max: 8 },
      { name: "writing", label: "Analytical Writing", min: 0, max: 6, step: 0.5 },
    ]
  },
  {
    id: "sat", name: "SAT", fields: [
      { name: "reading_writing", label: "Reading & Writing", min: 200, max: 800 },
      { name: "math", label: "Math", min: 200, max: 800 },
    ]
  },
];

export default function TestScores({ isOpen, onClose, onSubmit }: { isOpen: boolean; onClose: () => void; onSubmit: (data: any) => void }) {
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);
  const [testScores, setTestScores] = useState<Record<string, Record<string, string>>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const currentTest = TESTS.find((t) => t.id === selectedTestId);
  const progressPercent = selectedTestId ? 100 : 50;

  const handleTestSelect = (id: string) => {
    setSelectedTestId(id);
    setErrors({});
  };

  const handleSubmitInternal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTest) return;

    const data = testScores[currentTest.id];
    if (!data || Object.keys(data).length < currentTest.fields.length) {
      // simple validation
      return;
    }
    onSubmit({ testId: currentTest.id, scores: data });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
      <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="relative w-full max-w-4xl bg-[#0a0a0a] rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,1)] overflow-hidden flex flex-col md:flex-row h-[520px] border border-[#d4af37]/20 font-sans">

        <button onClick={onClose} className="absolute top-6 right-6 text-white/20 hover:text-white z-20 transition-all p-2 bg-white/5 rounded-xl group">
          <X size={24} className="group-hover:rotate-90 transition-transform" />
        </button>

        <div className="w-full md:w-[40%] bg-gradient-to-b from-[#FFB300] to-[#E6A100] p-12 flex flex-col items-center justify-center text-center text-[#0a0a0a] relative">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
          <div className="mb-8 p-6 bg-black/10 rounded-[2.5rem] backdrop-blur-xl border border-[#d4af37]/20 shadow-2xl relative z-10">
            <Trophy size={80} />
          </div>
          <h2 className="text-2xl font-black mb-4 leading-tight tracking-widest uppercase relative z-10">Score Sync</h2>
          <p className="text-[#0a0a0a]/70 text-[12px] font-black leading-relaxed uppercase tracking-widest relative z-10">
            {selectedTestId ? `Verifying performance metrics for ${currentTest?.name}.` : "Select a standardized test protocol to synchronize your scores."}
          </p>
        </div>

        <div className="flex-1 p-12 flex flex-col relative text-white">
          <div className="mb-8">
            <div className="flex justify-between items-end mb-4">
              <h1 className="text-xl font-black uppercase tracking-widest">Test Protocols</h1>
              <span className="text-[10px] font-black text-[#FFB300] uppercase tracking-[0.3em]">
                {selectedTestId ? "Field Input" : "Module Selection"}
              </span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
              <motion.div initial={{ width: 0 }} animate={{ width: `${progressPercent}%` }} className="bg-[#FFB300] h-full shadow-[0_0_15px_rgba(255,179,0,0.3)]" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
            <AnimatePresence mode="wait">
              {!selectedTestId ? (
                <motion.div key="list" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-3">
                  {TESTS.map(test => (
                    <button
                      key={test.id} onClick={() => handleTestSelect(test.id)}
                      className="w-full p-6 rounded-2xl border-2 border-white/5 bg-white/5 hover:border-[#FFB300]/50 hover:bg-[#FFB300]/5 transition-all text-left flex items-center justify-between group"
                    >
                      <span className="font-black uppercase tracking-widest text-[#FFB300] group-hover:text-white">{test.name}</span>
                      <ArrowRight size={20} className="text-white/20 group-hover:text-[#FFB300] group-hover:translate-x-1 transition-all" />
                    </button>
                  ))}
                </motion.div>
              ) : (
                <motion.div key="form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                  <div className="flex items-center gap-4 mb-6">
                    <button onClick={() => setSelectedTestId(null)} className="p-2 bg-white/5 rounded-xl hover:bg-white/10 text-[#FFB300] transition-all"><ArrowLeft size={20} /></button>
                    <h3 className="font-black text-[#FFB300] uppercase tracking-widest">{currentTest?.name} Parameters</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-6">
                    {currentTest?.fields.map(field => (
                      <div key={field.name} className="space-y-3">
                        <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-2">{field.label}</label>
                        <input
                          type="number" step={field.step || 1} min={field.min} max={field.max}
                          value={testScores[selectedTestId]?.[field.name] || ""}
                          onChange={(e) => setTestScores(prev => ({
                            ...prev, [selectedTestId]: { ...(prev[selectedTestId] || {}), [field.name]: e.target.value }
                          }))}
                          className="w-full px-6 py-4 bg-white/5 border-2 border-white/5 focus:border-[#FFB300]/50 rounded-2xl transition-all outline-none font-bold text-white placeholder:text-white/10"
                        />
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-auto pt-8 flex gap-4">
            {selectedTestId && (
              <button
                onClick={handleSubmitInternal}
                className="w-full py-4 bg-[#FFB300] text-[#0a0a0a] text-[10px] font-black rounded-2xl hover:bg-[#E6A100] transition-all shadow-[0_0_30px_rgba(255,179,0,0.3)] uppercase tracking-[0.3em] flex items-center justify-center gap-2"
              >
                Integrate Protocol <CheckCircle size={16} />
              </button>
            )}
          </div>
        </div>
      </motion.div>
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
      `}</style>
    </div>
  );
}
