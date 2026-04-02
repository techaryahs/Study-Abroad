"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
    id: "toefl",
    name: "TOEFL",
    fields: [
      { name: "reading", label: "TOEFL Reading Score", min: 0, max: 30 },
      { name: "speaking", label: "TOEFL Speaking Score", min: 0, max: 30 },
      { name: "listening", label: "TOEFL Listening Score", min: 0, max: 30 },
      { name: "writing", label: "TOEFL Writing Score", min: 0, max: 30 },
    ],
  },
  {
    id: "ielts",
    name: "IELTS",
    fields: [
      { name: "reading", label: "IELTS Reading Score", min: 0, max: 9, step: 0.5 },
      { name: "speaking", label: "IELTS Speaking Score", min: 0, max: 9, step: 0.5 },
      { name: "listening", label: "IELTS Listening Score", min: 0, max: 9, step: 0.5 },
      { name: "writing", label: "IELTS Writing Score", min: 0, max: 9, step: 0.5 },
    ],
  },
  {
    id: "duolingo",
    name: "Duolingo",
    fields: [
      { name: "literacy", label: "Literacy Score", min: 10, max: 160 },
      { name: "conversation", label: "Conversation Score", min: 10, max: 160 },
      { name: "comprehension", label: "Comprehension Score", min: 10, max: 160 },
      { name: "production", label: "Production Score", min: 10, max: 160 },
    ],
  },
  {
    id: "gre",
    name: "GRE",
    fields: [
      { name: "verbal", label: "Verbal Reasoning", min: 130, max: 170 },
      { name: "quantitative", label: "Quantitative Reasoning", min: 130, max: 170 },
      { name: "writing", label: "Analytical Writing", min: 0, max: 6, step: 0.5 },
    ],
  },
  {
    id: "gmat",
    name: "GMAT",
    fields: [
      { name: "verbal", label: "Verbal Score", min: 0, max: 60 },
      { name: "quantitative", label: "Quantitative Score", min: 0, max: 60 },
      { name: "reasoning", label: "Integrated Reasoning", min: 1, max: 8 },
      { name: "writing", label: "Analytical Writing", min: 0, max: 6, step: 0.5 },
    ],
  },
  {
    id: "mcat",
    name: "MCAT",
    fields: [
      { name: "physical", label: "Chemical and Physical", min: 118, max: 132 },
      { name: "analysis", label: "Critical Analysis", min: 118, max: 132 },
      { name: "biological", label: "Biological and Biochemical", min: 118, max: 132 },
      { name: "social", label: "Psychological and Social", min: 118, max: 132 },
    ],
  },
  {
    id: "pte",
    name: "PTE",
    fields: [
      { name: "reading", label: "Reading Score", min: 10, max: 90 },
      { name: "speaking", label: "Speaking Score", min: 10, max: 90 },
      { name: "listening", label: "Listening Score", min: 10, max: 90 },
      { name: "writing", label: "Writing Score", min: 10, max: 90 },
    ],
  },
  {
    id: "sat",
    name: "SAT",
    fields: [
      { name: "reading_writing", label: "Reading & Writing", min: 200, max: 800 },
      { name: "math", label: "Math Score", min: 200, max: 800 },
    ],
  },
  {
    id: "act",
    name: "ACT",
    fields: [
      { name: "english", label: "English Score", min: 1, max: 36 },
      { name: "math", label: "Math Score", min: 1, max: 36 },
      { name: "reading", label: "Reading Score", min: 1, max: 36 },
      { name: "science", label: "Science Score", min: 1, max: 36 },
    ],
  },
];

export default function TestScores({ isOpen, onClose, onSubmit }: { isOpen: boolean; onClose: () => void; onSubmit: () => void }) {
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);
  const [testScores, setTestScores] = useState<Record<string, Record<string, string>>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const completedCount = Object.keys(testScores).length;
  const currentTest = TESTS.find((t) => t.id === selectedTestId);

  const handleTestSelect = (id: string) => {
    setSelectedTestId(id);
    setErrors({});
  };

  const handleInputChange = (fieldName: string, value: string) => {
    if (!selectedTestId) return;
    setTestScores((prev) => ({
      ...prev,
      [selectedTestId]: {
        ...(prev[selectedTestId] || {}),
        [fieldName]: value,
      },
    }));
    if (errors[fieldName]) {
      const newErrors = { ...errors };
      delete newErrors[fieldName];
      setErrors(newErrors);
    }
  };

  const handleSubmitInternal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTest) return;

    const newErrors: Record<string, string> = {};
    currentTest.fields.forEach((field) => {
      const value = testScores[currentTest.id]?.[field.name];
      if (!value) {
        newErrors[field.name] = "This field is required";
      } else {
        const num = parseFloat(value);
        if (isNaN(num) || num < field.min || num > field.max) {
          newErrors[field.name] = `Score must be between ${field.min} and ${field.max}`;
        }
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
      />

      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative w-full max-w-[750px] bg-white rounded-xl overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[500px] font-sans"
      >
        {/* LEFT PANEL - ORANGE SIDEBAR */}
        <div className="w-[33%] bg-[#FFB300] p-8 flex flex-col items-center justify-center text-center gap-6 relative">
          <div className="w-[100px] h-[100px] bg-[#81D4FA] rounded-full flex items-center justify-center shadow-sm">
            <div className="bg-white p-3 rounded-md shadow-sm">
              <svg
                className="w-8 h-8 text-[#81D4FA]"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
              </svg>
            </div>
          </div>

          <div className="z-10">
            <h2 className="text-[26px] font-bold text-white mb-6 tracking-tight leading-tight">
              {selectedTestId ? `Add ${currentTest?.name} Scores` : "Add Test Details"}
            </h2>
            <p className="text-white font-medium leading-relaxed px-4 text-[13px] opacity-100">
              {selectedTestId
                ? `Enter your actual/expected scores(between ${currentTest?.fields[0].min} and ${currentTest?.fields[0].max}).`
                : "Please list any standardized tests you've taken in the past."}
            </p>
          </div>
        </div>

        {/* RIGHT PANEL - CONTENT AREA */}
        <div className="flex-1 p-6 bg-white flex flex-col">
          {/* HEADER */}
          <div className="flex justify-between items-center mb-1">
            <h1 className="text-[18px] font-bold text-[#424242]">
              {selectedTestId ? `Add ${currentTest?.name} Scores` : "Test Details"}
            </h1>
            <button onClick={onClose} className="text-[#424242] hover:opacity-70">
              <svg className="w-5 h-5 font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="text-[11px] text-[#9E9E9E] font-medium mb-1 text-right italic">
            {completedCount} of {TESTS.length} completed
          </div>

          {/* PROGRESS BAR */}
          <div className="w-full h-[3px] bg-[#EEEEEE] rounded-full overflow-hidden mb-6">
            <motion.div
              className="h-full bg-[#4CAF50]"
              initial={{ width: 0 }}
              animate={{ width: `${(completedCount / TESTS.length) * 100}%` }}
            />
          </div>

          <div className="flex-1 relative">
            <AnimatePresence mode="wait">
              {!selectedTestId ? (
                /* SELECTION VIEW */
                <motion.div
                  key="selection"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col h-full"
                >
                  <p className="text-[#616161] text-[14px] mb-5 font-medium ml-4">Select tests you have appeared for</p>
                  
                  <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar max-h-[350px] px-1 pb-4">
                    {TESTS.map((test) => (
                      <button
                        key={test.id}
                        onClick={() => handleTestSelect(test.id)}
                        className={`w-full p-4 rounded-lg border flex items-center gap-5 transition-all duration-200 text-left ${
                          testScores[test.id]
                            ? "border-[#4CAF50] bg-white"
                            : "border-[#E0E0E0] bg-white hover:border-[#4CAF50]/50"
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full border-[1.5px] flex items-center justify-center transition-all ${
                            testScores[test.id]
                              ? "bg-[#4CAF50] border-[#4CAF50]"
                              : "border-[#BDBDBD] bg-white group-hover:border-[#4CAF50]"
                          }`}
                        >
                          {testScores[test.id] && (
                            <svg
                              className="w-4 h-4 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={4}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </div>
                        <span className="text-[14px] text-[#757575] font-semibold uppercase tracking-wide">
                          {test.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                /* FORM VIEW */
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col h-full"
                >
                  <form onSubmit={handleSubmitInternal} className="space-y-6 px-1">
                    <div className="flex items-center justify-between mb-4">
                       <p className="text-[#757575] text-[14px] font-medium leading-relaxed">
                        Enter your actual/expected scores(between {currentTest?.fields[0].min || 0} and {currentTest?.fields[0].max || 0}).
                      </p>
                      <button
                        type="button"
                        onClick={() => setSelectedTestId(null)}
                        className="text-[#212121] hover:opacity-60 transition-opacity"
                      >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                      </button>
                    </div>

                    <div className="space-y-8 pt-2">
                      {currentTest?.fields.map((field) => (
                        <div key={field.name} className="relative group">
                          <label
                            className={`absolute left-3 -top-2 px-1 bg-white text-[11px] font-bold uppercase transition-colors z-10 ${
                              errors[field.name] ? "text-red-500" : "text-[#BDBDBD] group-focus-within:text-[#4CAF50]"
                            }`}
                          >
                            {field.label}
                          </label>
                          <input
                            type="number"
                            step={field.step || 1}
                            min={field.min}
                            max={field.max}
                            value={testScores[selectedTestId]?.[field.name] || ""}
                            onChange={(e) => handleInputChange(field.name, e.target.value)}
                            placeholder={field.label}
                            className={`w-full bg-white border rounded-md py-[14px] px-4 text-[#424242] outline-none transition-all ${
                              errors[field.name]
                                ? "border-red-500"
                                : "border-[#E0E0E0] focus:border-[#4CAF50] focus:ring-[0.5px] focus:ring-[#4CAF50]"
                            }`}
                          />
                          {errors[field.name] && (
                            <span className="absolute left-0 -bottom-5 text-[10px] text-red-500 font-bold italic">
                              *{errors[field.name]}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-end pt-8">
                      <button type="submit" className="bg-[#1DB954] hover:bg-[#1AA34A] text-white px-10 py-3 rounded-lg font-bold shadow-sm transition-all active:scale-95 text-[14px]">
                        Submit
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #fafafa;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e0e0e0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #bdbdbd;
        }
      `}</style>
    </div>
  );
}
