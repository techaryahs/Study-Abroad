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
    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-10 font-sans max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#eef6ff] rounded-2xl flex items-center justify-center text-[#4d97f3]">
             <ClipboardList size={24} />
          </div>
          <div>
            <h2 className="text-3xl font-light text-gray-500 tracking-tight">Language scores</h2>
            <p className="text-[10px] font-black uppercase text-gray-300 tracking-widest mt-1">Standardized Test Protocols</p>
          </div>
        </div>
        <button 
          onClick={onEdit}
          className="px-10 py-3 bg-[#eef6ff] text-[#4d97f3] rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-[#dfeeff] transition-all border border-[#dcebff]"
        >
          Add or Edit Tests
        </button>
      </div>

      <div className="h-[1px] w-full bg-gray-50 mb-12" />

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
              <div className="flex items-end justify-between mb-8 pb-4 border-b border-gray-50">
                <div className="flex items-center gap-6">
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:text-[#4d97f3] transition-colors">
                    <Trophy size={18} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-[13px] font-black text-gray-700 uppercase tracking-widest">
                      YOUR {test.name} RESULT :
                    </h3>
                    <div className="h-0.5 w-8 bg-[#4d97f3]/20 rounded-full" />
                  </div>
                </div>

                <div className="flex items-center gap-12">
                   <div className="text-right">
                      <span className="block text-[9px] font-black text-gray-300 uppercase tracking-widest mb-1">Total Score</span>
                      <div className="text-5xl font-black text-[#4d97f3] tracking-tighter tabular-nums drop-shadow-sm">
                        {test.score || "00"}
                      </div>
                   </div>
                   <button 
                     onClick={() => onRemove?.(test.id)}
                     className="p-2 text-gray-200 hover:text-red-500 transition-colors"
                   >
                     <Trash2 size={18} />
                   </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
                {Object.entries(test.sections).map(([field, value]: [string, any]) => {
                  if (!value && value !== 0) return null;
                  if (field === 'overall' || field === 'total') return null;

                  return (
                    <div 
                      key={field} 
                      className="flex flex-col gap-2 p-5 border border-gray-50 rounded-2xl bg-[#fafbfc]/50 group-hover:bg-white group-hover:border-[#4d97f3]/10 transition-all shadow-sm"
                    >
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter capitalize">
                        {field} :
                      </span>
                      <span className="text-xl font-black text-gray-800 tracking-tighter">
                        {value}
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))
        ) : (
          <div className="py-24 text-center border-2 border-dashed border-gray-50 rounded-[2.5rem] bg-[#fafbfc]/30">
            <p className="text-xs text-gray-300 font-black uppercase tracking-[0.4em]">Initialize test protocols to see telemetry.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── MODAL COMPONENT (FOR ADDING SCORES) ──
interface TestScoresModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
}

const testDefinitions: any = {
  toefl: { name: 'TOEFL', sections: ['reading', 'speaking', 'listening', 'writing'] },
  ielts: { name: 'IELTS', sections: ['reading', 'speaking', 'listening', 'writing', 'overall'] },
  duolingo: { name: 'Duolingo', sections: ['literacy', 'comprehension', 'conversation', 'production', 'overall'] },
  gre: { name: 'GRE', sections: ['verbal', 'quantitative', 'awa', 'total'] },
  gmat: { name: 'GMAT', sections: ['quantitative', 'verbal', 'ir', 'awa', 'total'] },
  mcat: { name: 'MCAT', sections: ['cpbs', 'cars', 'bbls', 'psbb', 'total'] }
};

export const TestScoresModal = ({ isOpen, onClose, onSubmit }: TestScoresModalProps) => {
  const [selectedTest, setSelectedTest] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});

  const handleTestSelect = (testId: string) => {
    setSelectedTest(testId);
    const def = testDefinitions[testId];
    const initial: any = {};
    def.sections.forEach((s: string) => initial[s] = '');
    setFormData(initial);
  };

  const handleSave = () => {
    if (!selectedTest) return;
    
    // Auto-calculate TOEFL total if needed
    let finalScore = '';
    if (selectedTest === 'toefl') {
        const sum = Object.values(formData).reduce((acc: number, v: any) => acc + (Number(v) || 0), 0);
        finalScore = sum.toString();
    } else {
        finalScore = formData.overall || formData.total || '';
    }

    onSubmit({
      testType: selectedTest.toUpperCase(),
      score: finalScore,
      sectionScores: formData
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
      
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }}
        className="relative bg-[#0a0a0a] border border-white/10 rounded-[3rem] w-full max-w-2xl overflow-hidden shadow-3xl"
      >
        <div className="flex flex-col h-full max-h-[90vh]">
          {/* Header */}
          <div className="p-10 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-gold-500/10 rounded-2xl flex items-center justify-center text-gold-500">
                <Trophy size={24} />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-black text-white uppercase tracking-widest leading-none">Record Benchmark</h3>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Protocol Identification</p>
              </div>
            </div>
            <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-2xl text-gray-500 hover:text-white transition-all">
              <X size={20} />
            </button>
          </div>

          <div className="p-10 overflow-y-auto space-y-10 custom-scrollbar">
            {!selectedTest ? (
              <div className="grid grid-cols-2 gap-4">
                {Object.keys(testDefinitions).map((testId) => (
                  <button
                    key={testId}
                    onClick={() => handleTestSelect(testId)}
                    className="group relative p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-gold-500/30 transition-all text-left overflow-hidden"
                  >
                    <div className="relative z-10">
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest group-hover:text-gold-500 transition-colors">Protocol:</span>
                      <h4 className="text-2xl font-black text-white italic tracking-tighter mt-1">{testDefinitions[testId].name}</h4>
                    </div>
                    <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Plus size={16} className="text-gold-500" />
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                   <button onClick={() => setSelectedTest(null)} className="text-[10px] font-black text-gray-500 hover:text-white transition-colors uppercase tracking-widest">Back to Protocol List</button>
                   <span className="text-[11px] font-black text-gold-500 uppercase tracking-widest">{selectedTest.toUpperCase()} CONFIGURATION</span>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  {testDefinitions[selectedTest].sections.map((section: string) => (
                    <div key={section} className="space-y-4">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">{section}</label>
                      <input
                        type="text"
                        value={formData[section] || ''}
                        onChange={(e) => setFormData({ ...formData, [section]: e.target.value })}
                        placeholder="N/A"
                        className="w-full h-14 bg-white/[0.03] border border-white/5 rounded-2xl px-6 text-white font-bold text-sm focus:outline-none focus:border-gold-500/50 transition-all placeholder:text-gray-800"
                      />
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleSave}
                  className="w-full py-5 bg-gold-500 text-black rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] hover:bg-gold-400 transition-all shadow-[0_20px_40px_rgba(194,168,120,0.2)]"
                >
                   Finalize Metrics
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
