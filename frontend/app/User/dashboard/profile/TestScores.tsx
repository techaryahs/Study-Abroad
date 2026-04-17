'use client';

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Trophy, ClipboardList, X, CheckCircle, Plus } from 'lucide-react';

interface TestScoresProps {
  testScores?: any;
  onEdit?: () => void;
  onRemove?: (testKey: string) => void;
}

// ── VIEW COMPONENT (FOR DASHBOARD TABS) ──
export default function TestScores({ testScores = {}, onEdit, onRemove }: TestScoresProps) {
  const normalizeData = () => {
    const list: any[] = [];
    if (Array.isArray(testScores)) {
      testScores.forEach(t => {
        list.push({
          id: t.testType.toLowerCase(),
          name: t.testType,
          score: t.score,
          sections: t.sectionScores
        });
      });
    } else {
      Object.keys(testScores).forEach(testKey => {
        const scores = testScores[testKey];
        const hasData = scores && Object.values(scores).some(v => v !== '' && v !== null);
        if (hasData) {
          list.push({
            id: testKey,
            name: testKey.toUpperCase(),
            score: (scores.overall || scores.total || ''),
            sections: scores
          });
        }
      });
    }
    return list;
  };

  const activeTests = normalizeData();

  return (
    <div className="bg-white rounded-[2.5rem] border border-[#F1EDEA] shadow-sm p-10 font-sans max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#C5A059]/10 rounded-2xl flex items-center justify-center text-[#C5A059] shadow-inner">
             <ClipboardList size={24} />
          </div>
          <div>
            <h2 className="text-3xl font-light text-[#3C2A21] tracking-tight uppercase italic">Language scores</h2>
            <p className="text-[14px] font-bold font-black uppercase text-[#6B5E51]/70 tracking-widest mt-1">Standardized Test Protocols</p>
          </div>
        </div>
        <button 
          onClick={onEdit}
          className="px-10 py-3 bg-[#C5A059]/10 text-[#C5A059] rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-[#C5A059] hover:text-white transition-all border border-[#C5A059]/20"
        >
          Add or Edit Tests
        </button>
      </div>

      <div className="h-[1px] w-full bg-[#FDFBF7] mb-12 border-b border-[#F1EDEA]" />

      <div className="space-y-16">
        {activeTests.length > 0 ? (
          activeTests.map((test, index) => (
            <motion.div 
              key={test.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative"
            >
              <div className="flex items-end justify-between mb-8 pb-4 border-b border-[#F1EDEA]">
                <div className="flex items-center gap-6">
                  <div className="w-10 h-10 bg-[#FDFBF7] rounded-xl flex items-center justify-center text-[#6B5E51] group-hover:text-[#C5A059] transition-colors shadow-inner">
                    <Trophy size={18} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-[13px] font-black text-[#6B5E51] uppercase tracking-widest">
                      YOUR {test.name} RESULT :
                    </h3>
                    <div className="h-0.5 w-8 bg-[#C5A059]/20 rounded-full" />
                  </div>
                </div>

                <div className="flex items-center gap-12">
                   <div className="text-right">
                      <span className="block text-[13px] font-bold font-black text-[#6B5E51]/70 uppercase tracking-widest mb-1">Total Score</span>
                      <div className="text-5xl font-black text-[#C5A059] tracking-tighter tabular-nums drop-shadow-sm">
                        {test.score || "00"}
                      </div>
                   </div>
                   <button 
                     onClick={() => onRemove?.(test.id)}
                     className="p-2 text-[#6B5E51]/30 hover:text-red-500 transition-colors"
                   >
                     <Trash2 size={18} />
                   </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-12 gap-y-10 px-4">
                {test.sections && Object.entries(test.sections).map(([section, score]: any) => (
                   (section !== 'overall' && section !== 'total' && section !== '_id') && (
                    <div key={section} className="space-y-1 cursor-default group/sec">
                      <p className="text-[13px] font-bold font-black text-[#6B5E51]/70 uppercase tracking-widest group-hover/sec:text-[#C5A059] transition-colors">{section}</p>
                      <p className="text-2xl font-black text-[#3C2A21] tabular-nums">{score}</p>
                    </div>
                   )
                ))}
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-20 bg-[#FDFBF7] rounded-[2rem] border-2 border-dashed border-[#F1EDEA]">
            <p className="text-[14px] font-bold font-black uppercase text-[#6B5E51]/20 tracking-[0.5em]">No performance vectors recorded</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── MODAL COMPONENT (FOR ADDING/EDITING) ──
const testDefinitions: any = {
  toefl: { name: 'TOEFL', sections: ['reading', 'speaking', 'listening', 'writing', 'total'] },
  ielts: { name: 'IELTS', sections: ['reading', 'speaking', 'listening', 'writing', 'overall'] },
  duolingo: { name: 'Duolingo', sections: ['literacy', 'comprehension', 'conversation', 'production', 'overall'] },
  gre: { name: 'GRE', sections: ['verbal', 'quantitative', 'awa', 'total'] },
  gmat: { name: 'GMAT', sections: ['quantitative', 'verbal', 'ir', 'awa', 'total'] },
  mcat: { name: 'MCAT', sections: ['cpbs', 'cars', 'bbls', 'psbb', 'total'] }
};

export const TestScoresModal = ({ isOpen, onClose, onSubmit }: any) => {
  const [selectedTest, setSelectedTest] = useState<string | null>(null);
  const [scores, setScores] = useState<any>({});

  if (!isOpen) return null;

  const currentTestDef = selectedTest ? testDefinitions[selectedTest] : null;

  const handleScoreChange = (section: string, value: string) => {
    setScores((prev: any) => ({
      ...prev,
      [selectedTest!]: {
        ...(prev[selectedTest!] || {}),
        [section]: value
      }
    }));
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={onClose} className="absolute inset-0 bg-[#3C2A21]/40 backdrop-blur-md" />
      <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="relative w-full max-w-3xl bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-3xl overflow-hidden flex flex-col md:flex-row h-auto md:h-[500px] max-h-[95vh] border border-[#C5A059]/15 font-sans">
        <button onClick={onClose} className="absolute top-4 right-4 md:top-6 md:right-6 text-[#6B5E51]/70 hover:text-[#C5A059] z-20 transition-all p-2 bg-[#FDFBF7] border border-[#F1EDEA] rounded-xl group">
             <X size={18} className="md:w-5 md:h-5 group-hover:rotate-90 transition-transform" />
        </button>

        <div className="w-full md:w-[35%] bg-gradient-to-b from-[#C5A059] to-[#3C2A21] p-6 md:p-10 flex flex-row md:flex-col items-center justify-center text-center text-white relative">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
          <div className="mb-0 md:mb-6 p-3 md:p-5 bg-white/10 rounded-2xl md:rounded-[2rem] backdrop-blur-xl border border-white/20 shadow-2xl relative z-10 shrink-0">
            <Trophy size={32} className="md:w-[60px] md:h-[60px]" />
          </div>
          <div className="ml-4 md:ml-0 text-left md:text-center relative z-10 leading-tight">
            <h2 className="text-md md:text-xl font-black mb-0.5 md:mb-2 leading-tight tracking-widest uppercase italic">Score Node</h2>
            <p className="text-white/70 text-[13px] font-bold md:text-[11px] font-black leading-relaxed uppercase tracking-widest hidden sm:block">
              {!selectedTest ? "Registry selection." : "Sync score metrics."}
            </p>
          </div>
        </div>

        <div className="flex-1 p-6 md:p-10 flex flex-col relative text-[#3C2A21] overflow-y-auto md:overflow-hidden">
          <div className="mb-8">
            <div className="flex justify-between items-end mb-4">
              <h1 className="text-sm md:text-lg font-black uppercase tracking-widest italic">Sync Score Registry</h1>
              <span className="text-[14px] font-bold font-black text-[#C5A059] uppercase tracking-[0.3em]">{selectedTest ? "Data Sync" : "Selection"}</span>
            </div>
            <div className="h-1.5 w-full bg-[#FDFBF7] rounded-full border border-[#F1EDEA] overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: selectedTest ? '100%' : '50%' }} className="bg-[#C5A059] h-full shadow-sm" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar pr-2">
            <AnimatePresence mode="wait">
              {!selectedTest ? (
                <motion.div key="selection" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="grid grid-cols-2 gap-4">
                  {Object.keys(testDefinitions).map(testId => (
                    <button 
                      key={testId} 
                      onClick={() => setSelectedTest(testId)}
                      className="p-5 bg-[#FDFBF7] border border-[#F1EDEA] rounded-2xl flex flex-col items-center gap-3 hover:border-[#C5A059]/40 hover:bg-white transition-all shadow-sm group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#6B5E51] group-hover:text-[#C5A059] shadow-inner transition-colors"><Plus size={18} /></div>
                      <span className="text-[14px] font-bold font-black text-[#6B5E51] uppercase tracking-widest">{testDefinitions[testId].name}</span>
                    </button>
                  ))}
                </motion.div>
              ) : (
                <motion.div key="form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="flex items-center gap-4 mb-4">
                    <button onClick={() => setSelectedTest(null)} className="text-[14px] font-bold font-black text-[#C5A059] uppercase tracking-widest underline underline-offset-4 decoration-2">Change Test</button>
                    <div className="h-3 w-[1px] bg-[#F1EDEA]" />
                    <h3 className="text-md font-black text-[#3C2A21] uppercase tracking-tighter italic">{currentTestDef.name} Protocol</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {currentTestDef.sections.map((sec: string) => (
                      <div key={sec} className="space-y-1.5">
                        <label className="text-[13px] font-bold font-black text-[#6B5E51]/60 uppercase tracking-widest ml-1">{sec}</label>
                        <input 
                          type="text" 
                          value={scores[selectedTest!]?.[sec] || ''} 
                          onChange={(e) => handleScoreChange(sec, e.target.value)}
                          className="w-full bg-[#FDFBF7] border border-[#F1EDEA] rounded-xl p-4 text-xs font-bold text-[#3C2A21] focus:border-[#C5A059] outline-none transition-all shadow-inner"
                        />
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={() => onSubmit({ testType: selectedTest!.toUpperCase(), score: scores[selectedTest!]?.total || scores[selectedTest!]?.overall || '0', sectionScores: scores[selectedTest!] })}
                    className="w-full py-5 bg-[#3C2A21] text-white rounded-2xl font-black uppercase text-[14px] font-bold tracking-widest hover:bg-[#C5A059] shadow-xl transition-all active:scale-95"
                  >
                    Validate and Sync
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
