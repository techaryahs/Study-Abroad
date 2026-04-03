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
  }, [stream]);

  const initials = label
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={`relative rounded-2xl overflow-hidden bg-[#0d0d0d] border aspect-video flex items-center justify-center transition-all duration-300 ${
        isSpeaking
          ? "border-[#d4af37]/60 shadow-[0_0_20px_rgba(212,175,55,0.2)]"
          : "border-white/[0.06]"
      }`}
    >
      {/* Video or Avatar */}
      {stream && !isVideoOff ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isLocal}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#d4af37]/20 to-[#d4af37]/5 border border-[#d4af37]/30 flex items-center justify-center text-xl font-black text-[#d4af37]">
            {initials || "?"}
          </div>
          <span className="text-white/30 text-xs font-medium">
            {isVideoOff ? "Camera off" : "Connecting…"}
          </span>
        </div>
      )}

      {/* Ambient glow when speaking */}
      {isSpeaking && (
        <div className="absolute inset-0 rounded-2xl border border-[#d4af37]/40 pointer-events-none animate-pulse" />
      )}

      {/* Name + Host badge */}
      <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
        {isHost && (
          <span className="bg-[#d4af37] text-black text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md">
            Host
          </span>
        )}
        {isLocal && (
          <span className="bg-white/10 text-white/60 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md backdrop-blur-sm">
            You
          </span>
        )}
        <span className="bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-lg font-medium max-w-[140px] truncate">
          {label}
        </span>
      </div>

      {/* Muted indicator */}
      {isMuted && (
        <div className="absolute top-3 right-3 w-7 h-7 bg-red-500/90 rounded-full flex items-center justify-center shadow-lg">
          <svg
            className="w-3.5 h-3.5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <line x1="1" y1="1" x2="23" y2="23" />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 9v3a3 3 0 005.12 2.12M15 9.34V4a3 3 0 00-5.94-.6"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 16.95A7 7 0 015 12v-2m14 0v2a7 7 0 01-.11 1.23M12 19v4M8 23h8"
            />
          </svg>
        </div>
      )}
    </div>
  );
}
