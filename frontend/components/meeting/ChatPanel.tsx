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
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: 300, opacity: 1 }}
        exit={{ width: 0, opacity: 0 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="flex-shrink-0 border-l border-white/[0.06] bg-[#080808]/95 backdrop-blur-xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-white/[0.06] flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-pulse" />
            <span className="text-white font-bold text-sm tracking-wide">
              Session Chat
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-white/30 hover:text-white hover:bg-white/5 transition-all text-xs"
          >
            ✕
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin scrollbar-thumb-white/10">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full gap-2 text-white/20 py-8">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg>
              <p className="text-xs">No messages yet</p>
            </div>
          )}
          {messages.map((m) => {
            const isMe = m.sender === myName;
            return (
              <div
                key={m.id}
                className={`flex flex-col gap-0.5 ${isMe ? "items-end" : "items-start"}`}
              >
                <span className="text-white/30 text-[10px] px-1">
                  {isMe ? "You" : m.sender} · {m.at}
                </span>
                <div
                  className={`max-w-[220px] px-3 py-2 rounded-xl text-sm leading-relaxed ${
                    isMe
                      ? "bg-[#d4af37] text-black font-medium rounded-br-sm"
                      : "bg-[#141414] border border-white/[0.06] text-white rounded-bl-sm"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            );
          })}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 border-t border-white/[0.06] flex gap-2 flex-shrink-0">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && onSend()}
            placeholder="Type a message…"
            className="flex-1 bg-[#141414] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#d4af37]/40 transition-colors"
          />
          <button
            onClick={onSend}
            disabled={!chatInput.trim()}
            className="bg-[#d4af37] text-black px-3 py-2 rounded-xl text-xs font-bold hover:bg-yellow-400 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
