"use client";

import { useEffect, useRef } from "react";

interface VideoTileProps {
  stream: MediaStream | null | undefined;
  label: string;
  isHost: boolean;
  isMuted: boolean;
  isVideoOff: boolean;
  isLocal?: boolean;
  isSpeaking?: boolean;
}

export default function VideoTile({
  stream,
  label,
  isHost,
  isMuted,
  isVideoOff,
  isLocal = false,
  isSpeaking = false,
}: VideoTileProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, isVideoOff]);

  const initials = label
    .split("@")[0]
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={`relative rounded-[2rem] overflow-hidden bg-[#0A0A0A] border transition-all duration-700 h-full flex items-center justify-center ${
        isSpeaking
          ? "border-[#d4af37]/60 shadow-[0_0_40px_rgba(212,175,55,0.1)] ring-1 ring-[#d4af37]/20"
          : "border-white/[0.05]"
      }`}
    >
      {/* Background Ambience */}
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent pointer-events-none z-10" />

      {/* Video or Avatar */}
      {stream && !isVideoOff ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isLocal}
          className={`w-full h-full object-cover transition-transform duration-1000 ${isSpeaking ? "scale-[1.03]" : "scale-100"}`}
        />
      ) : (
        <div className="relative flex flex-col items-center gap-6 group">
          <div className="w-20 md:w-24 h-20 md:h-24 rounded-full bg-gradient-to-br from-[#d4af37] to-[#8a6d29] p-[1px] shadow-2xl relative z-20">
            <div className="w-full h-full rounded-full bg-[#0A0A0A] flex items-center justify-center text-2xl font-black text-[#d4af37] tracking-tighter">
              {initials || "?"}
            </div>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#d4af37]/5 blur-3xl rounded-full opacity-40 animate-pulse" />
          <span className="text-white/20 text-[10px] uppercase font-black tracking-[0.3em] relative z-20">
            {isVideoOff ? "Video Suspended" : "Initializing..."}
          </span>
        </div>
      )}

      {/* Speaking Glow Overlay */}
      {isSpeaking && (
        <div className="absolute inset-0 pointer-events-none z-20">
          <div className="absolute inset-0 border-2 border-[#d4af37]/30 rounded-[2rem] animate-[ping_2s_infinite]" />
        </div>
      )}

      {/* Bottom Info Section */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none z-30">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-black/40 backdrop-blur-xl rounded-full border border-white/10 shadow-xl">
          {isHost && (
            <div className="w-2 h-2 rounded-full bg-[#d4af37] shadow-[0_0_10px_#d4af37]" />
          )}
          <span className="text-white text-[11px] font-bold tracking-tight">
            {label} {isLocal && "(You)"}
          </span>
          {isHost && (
            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-[#d4af37]/70 ml-1">
              Admin
            </span>
          )}
        </div>

        {isMuted && (
          <div className="w-8 h-8 bg-red-500/20 backdrop-blur-xl rounded-full flex items-center justify-center border border-red-500/30">
            <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
               <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4" />
               <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}
