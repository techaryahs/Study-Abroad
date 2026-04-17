"use client";

interface ControlBtnProps {
  onClick: () => void;
  active?: boolean;
  danger?: boolean;
  title: string;
  children: React.ReactNode;
  id?: string;
  disabled?: boolean;
}

function ControlBtn({
  onClick,
  active,
  danger,
  title,
  children,
  id,
  disabled = false,
}: ControlBtnProps) {
  return (
    <button
      id={id}
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={`
        w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300 disabled:opacity-20 disabled:scale-95
        ${
          danger
            ? "bg-[#EA4335] text-white hover:bg-[#d93025] shadow-lg shadow-red-500/20"
            : active
            ? "bg-[#3c4043] text-white hover:bg-[#434649]"
            : "bg-white/[0.08] text-white hover:bg-white/[0.12] border border-white/5"
        }
      `}
    >
      {children}
    </button>
  );
}

interface ControlsProps {
  isAudioMuted: boolean;
  isVideoOff: boolean;
  showChat: boolean;
  isHost: boolean;
  isCalling: boolean;
  onToggleAudio: () => void;
  onToggleVideo: () => void;
  onToggleChat: () => void;
  onStartCall: () => void;
  onLeave: () => void;
  onRepair: () => void;
}

export default function Controls({
  isAudioMuted,
  isVideoOff,
  showChat,
  isHost,
  isCalling,
  onToggleAudio,
  onToggleVideo,
  onToggleChat,
  onStartCall,
  onLeave,
  onRepair,
}: ControlsProps) {
  return (
    <div className="flex-shrink-0 h-20 md:h-24 px-4 md:px-8 flex items-center justify-between bg-black/98 relative z-50">
      
      {/* Session ID / Meeting Info (Desktop Only) */}
      <div className="hidden lg:flex flex-col">
        <span className="text-white text-sm font-medium">Session Room</span>
        <span className="text-white/40 text-[14px] font-bold uppercase tracking-widest font-black">Live Encryption Active</span>
      </div>

      {/* Main Controls Overlay */}
      <div className="flex items-center gap-2 md:gap-4 absolute left-1/2 -translate-x-1/2">
        {/* Mute */}
        <ControlBtn
          id="toggle-mic-btn"
          onClick={onToggleAudio}
          active={isAudioMuted}
          title={isAudioMuted ? "Unmute" : "Mute"}
        >
          {isAudioMuted ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth={2} />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          )}
        </ControlBtn>

        {/* Camera */}
        <ControlBtn
          id="toggle-cam-btn"
          onClick={onToggleVideo}
          active={isVideoOff}
          title={isVideoOff ? "Cam On" : "Cam Off"}
        >
          {isVideoOff ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.868V15.13a1 1 0 01-1.447.9L15 14" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M3 8a2 2 0 012-2h.5M21 8v8a2 2 0 01-2 2H5.5" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.868V15.13a1 1 0 01-1.447.9L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
            </svg>
          )}
        </ControlBtn>

        {/* Chat */}
        <ControlBtn
          id="toggle-chat-btn"
          onClick={onToggleChat}
          active={!showChat} // Inverted color for chat to show it's "off" by default
          title="Chat"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          </svg>
        </ControlBtn>

        {/* Host: Start Call */}
        {isHost && !isCalling && (
          <button
            id="start-call-btn"
            onClick={onStartCall}
            className="h-10 md:h-12 px-5 md:px-8 bg-[#d4af37] text-black font-black text-[14px] font-bold md:text-xs uppercase tracking-[0.2em] rounded-full hover:bg-yellow-400 transition-all shadow-lg active:scale-95"
          >
            Start Meeting
          </button>
        )}

        {/* Repair */}
        <ControlBtn
          id="repair-connection-btn"
          onClick={onRepair}
          title="Repair Connection"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </ControlBtn>

        {/* Leave */}
        <ControlBtn
          id="leave-meeting-btn"
          onClick={onLeave}
          danger
          title={isHost ? "End Call for All" : "Leave Meeting"}
        >
          <svg className="w-6 h-6 rotate-[135deg]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21 15.46l-5.27-.61-2.52 2.52c-2.83-1.44-5.15-3.75-6.59-6.59l2.53-2.53L8.54 3H3.03C2.45 13.15 10.85 21.56 21 20.97v-5.51z"/>
          </svg>
        </ControlBtn>
      </div>

      {/* Additional UI elements (Desktop Only) */}
      <div className="hidden lg:flex items-center gap-6">
        <div className="flex flex-col items-end">
          <span className="text-white/40 text-[13px] font-bold font-black uppercase tracking-[0.2em]">Signal Strength</span>
          <div className="flex gap-0.5 mt-1">
            <div className="w-1 h-2 bg-[#d4af37] rounded-sm" />
            <div className="w-1 h-3 bg-[#d4af37] rounded-sm" />
            <div className="w-1 h-4 bg-[#d4af37] rounded-sm" />
            <div className="w-1 h-5 bg-[#d4af37] rounded-sm opacity-30" />
          </div>
        </div>
      </div>
    </div>
  );
}
