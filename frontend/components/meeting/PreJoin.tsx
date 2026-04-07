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
    <div className="flex items-center justify-between py-1.5">
      <div className="flex items-center gap-2 text-white/40 text-sm">
        <span>{icon}</span>
        <span>{label}</span>
      </div>
      <span
        className={`text-sm font-semibold truncate max-w-[160px] ${
          mono ? "font-mono text-[#d4af37] tracking-wider text-xs" : "text-white"
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
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#d4af37]/5 blur-[180px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#d4af37]/3 blur-[120px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md bg-[#0a0a0a]/90 backdrop-blur-2xl border border-[#d4af37]/10 rounded-3xl p-8 space-y-6 relative z-10 shadow-2xl shadow-black/60"
      >
        {/* Header badge */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/20 flex items-center justify-center">
            <span className="text-sm">🎙️</span>
          </div>
          <div>
            <span className="text-[#d4af37] text-[10px] font-black tracking-widest uppercase block">
              {isHost ? "Host Entry" : "Meeting Room"}
            </span>
            <span className="text-white/20 text-[9px] uppercase tracking-wider">
              Global Counselling Center
            </span>
          </div>
        </div>

        {/* Title */}
        <div>
          <h1 className="text-2xl font-black text-white mb-1 uppercase tracking-tight">
            {isHost ? "Start Session" : "Ready to Join?"}
          </h1>
          <p className="text-white/30 text-xs leading-relaxed">
            {isHost
              ? "Students are waiting. Start the call when ready."
              : "Please configure your audio & video before entering."}
          </p>
        </div>

        {/* Session info card */}
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl px-4 py-1 divide-y divide-white/[0.04]">
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
          <label className="text-[10px] font-black text-white/40 uppercase tracking-[3px] block mb-2">
            Your Display Name
          </label>
          <input
            type="text"
            value={myName}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Enter your name"
            className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#d4af37]/50 transition-colors"
          />
        </div>

        {/* Media error */}
        {mediaError && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-xs leading-relaxed">
            ⚠️ {mediaError}
          </div>
        )}

        {/* Join button */}
        <button
          id="join-meeting-room-btn"
          onClick={onJoin}
          disabled={!myName.trim()}
          className="w-full py-4 bg-[#d4af37] text-black font-black text-sm rounded-2xl hover:bg-yellow-400 transition-all active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-[#d4af37]/20 uppercase tracking-wider"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.868V15.13a1 1 0 01-1.447.9L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
          </svg>
          {isHost ? "Allow Camera & Start Session" : "Allow Camera & Join"}
        </button>

        <p className="text-center text-white/20 text-[10px]">
          Your camera and microphone permission will be requested.
        </p>
      </motion.div>
    </div>
  );
}
