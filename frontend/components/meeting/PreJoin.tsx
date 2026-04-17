"use client";

import { motion } from "framer-motion";

interface SessionInfo {
  date?: string;
  time?: string;
  endTime?: string;
  consultantName?: string;
  meetingId?: string;
}

interface PreJoinProps {
  session: SessionInfo | null;
  myName: string;
  isHost: boolean;
  mediaError: string;
  onNameChange: (name: string) => void;
  onJoin: () => void;
}

function InfoRow({
  icon,
  label,
  value,
  mono = false,
}: {
  icon: string;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <div className="flex items-center gap-3 text-[#6B5E51] text-[14px] font-bold font-black uppercase tracking-[0.2em]">
        <span className="text-base">{icon}</span>
        <span>{label}</span>
      </div>
      <span
        className={`text-[11px] font-black truncate max-w-[160px] ${mono ? "font-mono text-[#C5A059] tracking-widest uppercase" : "text-[#3C2A21] tracking-widest uppercase"
          }`}
      >
        {value}
      </span>
    </div>
  );
}

export default function PreJoin({
  session,
  myName,
  isHost,
  mediaError,
  onNameChange,
  onJoin,
}: PreJoinProps) {
  return (
    <div className="fixed inset-0 bg-[#FDFBF7] font-base flex items-center justify-center p-4 selection:bg-[#C5A059]/20 z-[9999]">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-[60vh] bg-gradient-to-b from-[#C5A059]/5 to-transparent" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md bg-white border border-[#F1EDEA] rounded-[2.5rem] p-8 space-y-8 relative z-10 shadow-xl shadow-[#C5A059]/5"
      >
        {/* Header badge */}
        <div className="flex items-center gap-4 border-b border-[#F1EDEA] pb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#C5A059]/10 border border-[#C5A059]/20 flex items-center justify-center shadow-inner">
            <span className="text-xl">🎥</span>
          </div>
          <div>
            <span className="text-[#3C2A21] text-[14px] font-bold font-black tracking-[0.2em] uppercase block mb-1">
              {isHost ? "Host Portal" : "Join Session"}
            </span>
            <span className="text-[#6B5E51] text-[13px] font-bold uppercase tracking-widest font-bold">
              Global Counselling Center
            </span>
          </div>
        </div>

        {/* Title */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#3C2A21] mb-2 uppercase tracking-widest font-serif italic">
            {isHost ? "Start Session" : "Ready to Join?"}
          </h1>
          <p className="text-[#6B5E51] text-[14px] font-bold uppercase font-bold tracking-widest leading-relaxed">
            {isHost
              ? "Students are waiting. Start the call when ready."
              : "Please configure your audio & video before entering."}
          </p>
        </div>

        {/* Session info card */}
        <div className="bg-[#FDFBF7] border border-[#F1EDEA] rounded-[1.5rem] p-4 divide-y divide-[#F1EDEA] shadow-sm">
          <InfoRow
            icon="🎓"
            label="Counsellor"
            value={session?.consultantName ?? "—"}
          />
          <InfoRow icon="📅" label="Date" value={session?.date ?? "—"} />
          <InfoRow
            icon="⏱"
            label="Time"
            value={
              session?.time && session?.endTime
                ? `${session.time} – ${session.endTime}`
                : "—"
            }
          />
          <InfoRow
            icon="🆔"
            label="Meeting ID"
            value={session?.meetingId ?? "—"}
            mono
          />
        </div>

        {/* Name input */}
        <div>
          <label className="text-[13px] font-bold font-black text-[#6B5E51] uppercase tracking-[0.3em] block mb-3 pl-1">
            Your Display Name
          </label>
          <input
            type="text"
            value={myName}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Enter your name"
            className="w-full bg-[#FDFBF7] border border-[#F1EDEA] rounded-2xl px-5 py-4 text-xs font-bold text-[#3C2A21] placeholder-[#6B5E51]/50 focus:outline-none focus:border-[#C5A059]/50 focus:bg-white shadow-inner transition-all duration-300"
          />
        </div>

        {/* Media error */}
        {mediaError && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-xs font-bold uppercase tracking-widest text-center">
            ⚠️ {mediaError}
          </div>
        )}

        {/* Join button */}
        <button
          id="join-meeting-room-btn"
          onClick={onJoin}
          disabled={!myName.trim()}
          className="w-full py-4 bg-[#C5A059] text-white font-black text-[11px] rounded-2xl hover:bg-[#3C2A21] transition-all duration-500 active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-xl uppercase tracking-[0.2em]"
        >
          <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.868V15.13a1 1 0 01-1.447.9L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
          </svg>
          {isHost ? "Allow Camera & Start" : "Allow Camera & Join"}
        </button>

        <p className="text-center text-[#6B5E51] text-[13px] font-bold font-bold uppercase tracking-widest">
          Your camera and microphone permission will be requested.
        </p>
      </motion.div>
    </div>
  );
}
