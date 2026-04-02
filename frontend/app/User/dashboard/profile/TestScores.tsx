'use client';

import React from "react";
import { motion } from "framer-motion";
import { Trash2, Trophy, ArrowRight, ClipboardList } from 'lucide-react';

interface TestScoresProps {
  testScores?: any;
  onEdit?: () => void;
  onRemove?: (testKey: string) => void;
}

export default function TestScores({ testScores = {}, onEdit, onRemove }: TestScoresProps) {
  // Normalizing test data into an array of active tests
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
      {/* Header Section */}
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

      {/* Tests List - STACKED ONE BY ONE */}
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
              {/* Test Header Row */}
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

              {/* Score Grid for this test */}
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
