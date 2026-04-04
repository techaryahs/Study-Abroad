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
        flex flex-col items-center gap-1 px-4 py-2.5 rounded-2xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed
        ${
          danger
            ? "bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white hover:border-red-500"
            : active
            ? "bg-white/10 border border-white/15 text-white/60 hover:bg-white/15"
            : "bg-[#d4af37]/10 border border-[#d4af37]/20 text-[#d4af37] hover:bg-[#d4af37]/20"
        }
      `}
    >
      {children}
      <span className="text-[9px] font-semibold uppercase tracking-wider">
        {title}
      </span>
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
}: ControlsProps) {
  return (
    <div className="flex-shrink-0 bg-[#080808]/95 backdrop-blur-xl border-t border-white/[0.06] px-4 py-3 flex items-center justify-center gap-2 sm:gap-3">
      {/* Mute */}
      <ControlBtn
        id="toggle-mic-btn"
        onClick={onToggleAudio}
        active={isAudioMuted}
        title={isAudioMuted ? "Unmute" : "Mute"}
      >
        {isAudioMuted ? (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <line x1="1" y1="1" x2="23" y2="23" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 9v3a3 3 0 005.12 2.12M15 9.34V4a3 3 0 00-5.94-.6" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16.95A7 7 0 015 12v-2m14 0v2a7 7 0 01-.11 1.23M12 19v4M8 23h8" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" />
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
        active={showChat}
        title="Chat"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        </svg>
      </ControlBtn>

      {/* Host: Start Call */}
      {isHost && !isCalling && (
        <>
          <div className="w-px h-8 bg-white/10 mx-1" />
          <ControlBtn
            id="start-call-btn"
            onClick={onStartCall}
            title="Start"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 3l14 9-14 9V3z" />
            </svg>
          </ControlBtn>
        </>
      )}

      <div className="w-px h-8 bg-white/10 mx-1" />

      {/* Leave / End */}
      <ControlBtn
        id="leave-meeting-btn"
        onClick={onLeave}
        danger
        title={isHost ? "End Call" : "Leave"}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.68 13.31a16 16 0 003.41 2.6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7 2 2 0 012 2v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 2 2 0 01-.44-.44 19.79 19.79 0 01-3.07-8.67A2 2 0 014.34 4h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 12" />
          <line x1="23" y1="1" x2="1" y2="23" />
        </svg>
      </ControlBtn>
    </div>
  );
}
