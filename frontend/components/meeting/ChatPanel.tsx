"use client";

import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  at: string;
}

interface ChatPanelProps {
  messages: ChatMessage[];
  myName: string;
  chatInput: string;
  onInputChange: (val: string) => void;
  onSend: () => void;
  onClose: () => void;
}

export default function ChatPanel({
  messages,
  myName,
  chatInput,
  onInputChange,
  onSend,
  onClose,
}: ChatPanelProps) {
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <AnimatePresence>
      <motion.div
        key="chat-panel"
        initial={{ x: 320, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 320, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed inset-y-0 right-0 w-full md:w-[320px] bg-[#0A0A0A] border-l border-white/[0.08] flex flex-col z-[210] shadow-2xl"
      >
        {/* Header */}
        <div className="h-16 px-5 border-b border-white/[0.06] flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-[#d4af37]" />
            <h2 className="text-white font-black text-xs uppercase tracking-[0.2em]">
              In-call Messages
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-all"
          >
            ✕
          </button>
        </div>

        {/* Warning Badge */}
        <div className="px-5 py-3 bg-white/[0.03] border-b border-white/[0.05]">
          <p className="text-[14px] font-bold text-white/40 leading-relaxed">
            Messages can only be seen by people in the call and are deleted when the call ends.
          </p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin scrollbar-thumb-white/10">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4 py-8">
              <div className="w-12 h-12 rounded-2xl bg-white/[0.03] flex items-center justify-center text-white/20">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-[11px] text-white/20 uppercase tracking-widest font-bold">
                No history yet
              </p>
            </div>
          )}
          {messages.map((m) => {
            const isMe = m.sender === myName;
            return (
              <div
                key={m.id}
                className="flex flex-col gap-1.5"
              >
                <div className={`flex items-baseline gap-2 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                  <span className="text-white font-bold text-[11px] tracking-tight">
                    {isMe ? "You" : m.sender}
                  </span>
                  <span className="text-white/30 text-[13px] font-bold font-medium">
                    {m.at}
                  </span>
                </div>
                <div
                  className={`px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed ${
                    isMe
                      ? "bg-[#d4af37] text-black font-semibold rounded-tr-none"
                      : "bg-white/[0.06] text-white rounded-tl-none border border-white/[0.05]"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            );
          })}
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-[#0F0F0F] border-t border-white/[0.08]">
          <div className="flex items-end gap-2 bg-white/[0.03] border border-white/10 rounded-2xl p-2 focus-within:border-[#d4af37]/40 transition-all">
            <textarea
              rows={1}
              value={chatInput}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  onSend();
                }
              }}
              placeholder="Send a message…"
              className="flex-1 bg-transparent border-none px-3 py-2 text-[14px] text-white placeholder-white/20 focus:outline-none resize-none max-h-32"
            />
            <button
              onClick={onSend}
              disabled={!chatInput.trim()}
              className="w-10 h-10 bg-[#d4af37] text-black rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:opacity-20 flex-shrink-0 shadow-lg"
            >
              <svg className="w-5 h-5 translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
