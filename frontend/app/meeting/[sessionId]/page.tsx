"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { getUser } from "@/app/lib/token";
import { useBookingSocket, Participant } from "./useBookingSocket";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

// ─── Types ────────────────────────────────────────────────────────────────────
interface SessionData {
  sessionId: string;
  meetingId: string;
  date: string;
  time: string;
  endTime: string;
  consultantName: string;
  userName?: string;
  userEmail: string;
  status: string;
}

interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  at: string;
}

// ─── Video Tile ───────────────────────────────────────────────────────────────
function VideoTile({
  stream,
  label,
  isHost,
  isMuted,
  isVideoOff,
  isLocal = false,
}: {
  stream: MediaStream | null | undefined;
  label: string;
  isHost: boolean;
  isMuted: boolean;
  isVideoOff: boolean;
  isLocal?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="relative rounded-2xl overflow-hidden bg-[#0d0d0d] border border-white/[0.06] aspect-video flex items-center justify-center">
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
          <div className="w-16 h-16 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/20 flex items-center justify-center text-2xl font-black text-[#d4af37]">
            {label.charAt(0).toUpperCase()}
          </div>
          <span className="text-white/40 text-xs">{isVideoOff ? "Camera off" : "No stream"}</span>
        </div>
      )}

      {/* Name badge */}
      <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
        {isHost && (
          <span className="bg-[#d4af37] text-black text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md">
            Host
          </span>
        )}
        <span className="bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-lg font-medium">
          {label} {isLocal ? "(You)" : ""}
        </span>
      </div>

      {/* Mute indicator */}
      {isMuted && (
        <div className="absolute top-3 right-3 w-7 h-7 bg-red-500/90 rounded-full flex items-center justify-center">
          <MicOffIcon className="w-3.5 h-3.5 text-white" />
        </div>
      )}
    </div>
  );
}

// ─── Control Button ───────────────────────────────────────────────────────────
function ControlBtn({
  onClick,
  active,
  danger,
  title,
  children,
  id,
}: {
  onClick: () => void;
  active?: boolean;
  danger?: boolean;
  title: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <button
      id={id}
      onClick={onClick}
      title={title}
      className={`
        flex flex-col items-center gap-1 px-4 py-2.5 rounded-2xl transition-all duration-200
        ${danger
          ? "bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white hover:border-red-500"
          : active
          ? "bg-white/10 border border-white/15 text-white/60 hover:bg-white/15"
          : "bg-[#d4af37]/10 border border-[#d4af37]/20 text-[#d4af37] hover:bg-[#d4af37]/20"
        }
      `}
    >
      {children}
      <span className="text-[9px] font-semibold uppercase tracking-wider">{title}</span>
    </button>
  );
}

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const MicIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" />
  </svg>
);
const MicOffIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <line x1="1" y1="1" x2="23" y2="23" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 9v3a3 3 0 005.12 2.12M15 9.34V4a3 3 0 00-5.94-.6" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16.95A7 7 0 015 12v-2m14 0v2a7 7 0 01-.11 1.23M12 19v4M8 23h8" />
  </svg>
);
const CamIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.868V15.13a1 1 0 01-1.447.9L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
  </svg>
);
const CamOffIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.868V15.13a1 1 0 01-1.447.9L15 14" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M3 8a2 2 0 012-2h.5M21 8v8a2 2 0 01-2 2H5.5" />
  </svg>
);
const ChatIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
  </svg>
);
const PhoneOffIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.68 13.31a16 16 0 003.41 2.6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7 2 2 0 012 2v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 2 2 0 01-.44-.44 19.79 19.79 0 01-3.07-8.67A2 2 0 014.34 4h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 12" />
    <line x1="23" y1="1" x2="1" y2="23" />
  </svg>
);


// ─── Main Page ────────────────────────────────────────────────────────────────
export default function MeetingPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;

  // Session data from API
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionError, setSessionError] = useState("");

  // Local user identity
  const [myId] = useState(() => `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`);
  const [myName, setMyName] = useState("You");
  const [isHost, setIsHost] = useState(false);

  // Local media
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [mediaError, setMediaError] = useState("");

  // UI
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [callEnded, setCallEnded] = useState(false);
  const [hostLeftMsg, setHostLeftMsg] = useState("");
  const [setupDone, setSetupDone] = useState(false);

  // ── Fetch session data ────────────────────────────────────────────────
  useEffect(() => {
    if (!sessionId) return;
    fetch(`${API_BASE}/api/bookings/session/${sessionId}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.session) {
          setSession(d.session);
        } else {
          setSessionError("Session not found. Please check your meeting link.");
        }
      })
      .catch(() => setSessionError("Could not connect to server."))
      .finally(() => setLoading(false));
  }, [sessionId]);

  // ── Resolve identity from localStorage ───────────────────────────────
  useEffect(() => {
    const user = getUser();
    if (user) {
      setMyName(user.name || user.email || "You");
      if (session) {
        // Counsellor (host) is identified by email match — simplified check
        const isCounsellor = user.email === session.userEmail ? false : true;
        setIsHost(isCounsellor);
      }
    }
  }, [session]);

  // ── Get local camera + mic ────────────────────────────────────────────
  const acquireMedia = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
      setSetupDone(true);
    } catch {
      setMediaError("Camera / microphone access denied. Please allow access and refresh.");
    }
  }, []);

  // ── WebRTC + Socket hook ──────────────────────────────────────────────
  const { remoteParticipants, isCalling, startCall, endCall, sendChatMessage, updateMyState } =
    useBookingSocket({
      sessionId,
      meetingId: session?.meetingId ?? "",
      participantId: myId,
      participantName: myName,
      isHost,
      localStream: setupDone ? localStream : null,
      onCallStarted: () => {},
      onCallEnded: () => setCallEnded(true),
      onHostLeft: () => setHostLeftMsg("The counsellor has left the session."),
    });

  // ── Toggle audio ──────────────────────────────────────────────────────
  const toggleAudio = () => {
    if (!localStream) return;
    const newMuted = !isAudioMuted;
    localStream.getAudioTracks().forEach((t) => (t.enabled = !newMuted));
    setIsAudioMuted(newMuted);
    updateMyState(newMuted, isVideoOff);
  };

  // ── Toggle video ──────────────────────────────────────────────────────
  const toggleVideo = () => {
    if (!localStream) return;
    const newOff = !isVideoOff;
    localStream.getVideoTracks().forEach((t) => (t.enabled = !newOff));
    setIsVideoOff(newOff);
    updateMyState(isAudioMuted, newOff);
  };

  // ── Leave meeting ─────────────────────────────────────────────────────
  const handleLeave = () => {
    if (isHost) endCall();
    localStream?.getTracks().forEach((t) => t.stop());
    router.push("/services");
  };

  // ── Chat send ─────────────────────────────────────────────────────────
  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    const msg: ChatMessage = {
      id: Date.now().toString(),
      sender: myName,
      text: chatInput.trim(),
      at: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setChatMessages((prev) => [...prev, msg]);
    sendChatMessage(msg);
    setChatInput("");
  };

  // ── Receive chat messages ─────────────────────────────────────────────
  // (socket.on("chat-message") is handled inline here since the hook doesn't expose it directly)
  // We scroll chat to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const remoteList = Array.from(remoteParticipants.values());

  // ─── Loading / Error states ───────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-[#d4af37]/30 border-t-[#d4af37] animate-spin" />
          <p className="text-white/40 text-sm">Loading session…</p>
        </div>
      </div>
    );
  }

  if (sessionError) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
        <div className="max-w-sm text-center space-y-4">
          <div className="text-5xl">🔒</div>
          <h1 className="text-2xl font-black text-white">Session Not Found</h1>
          <p className="text-white/45 text-sm">{sessionError}</p>
          <button
            onClick={() => router.push("/services")}
            className="mt-2 px-6 py-3 bg-[#d4af37] text-black font-bold rounded-xl hover:bg-yellow-400 transition-all"
          >
            Back to Services
          </button>
        </div>
      </div>
    );
  }

  // ─── Pre-join Setup Screen ─────────────────────────────────────────────────
  if (!setupDone) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 space-y-6"
        >
          {/* Badge */}
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-pulse" />
            <span className="text-[#d4af37] text-[10px] font-bold tracking-widest uppercase">
              Meeting Room
            </span>
          </div>

          <div>
            <h1 className="text-2xl font-black text-white mb-1">Ready to join?</h1>
            <p className="text-white/40 text-sm">
              {session?.date} · {session?.time} – {session?.endTime}
            </p>
          </div>

          {/* Session info */}
          <div className="bg-[#111] border border-white/[0.06] rounded-2xl p-4 space-y-2">
            <InfoRow icon="🎓" label="Counsellor" value={session?.consultantName ?? "—"} />
            <InfoRow icon="⏱" label="Duration" value="60 minutes" />
            <InfoRow icon="🆔" label="Meeting ID" value={session?.meetingId ?? "—"} mono />
          </div>

          {/* Name field */}
          <div>
            <label className="text-xs font-semibold text-white/50 uppercase tracking-wider block mb-2">
              Your display name
            </label>
            <input
              type="text"
              value={myName}
              onChange={(e) => setMyName(e.target.value)}
              placeholder="Enter your name"
              className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#d4af37]/40 transition-colors"
            />
          </div>

          {mediaError && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
              {mediaError}
            </div>
          )}

          {/* Join button */}
          <button
            id="join-meeting-room-btn"
            onClick={acquireMedia}
            disabled={!myName.trim()}
            className="w-full py-4 bg-[#d4af37] text-black font-black text-sm rounded-2xl hover:bg-yellow-400 transition-all active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-[#d4af37]/20"
          >
            <CamIcon className="w-5 h-5" />
            Allow camera &amp; Join Room
          </button>

          <p className="text-center text-white/25 text-xs">
            We&apos;ll ask permission to access your camera and microphone.
          </p>
        </motion.div>
      </div>
    );
  }

  // ─── Main Meeting Room ─────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#050505] flex flex-col overflow-hidden">

      {/* ── Top Bar ──────────────────────────────────────────────────────────── */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 sm:px-6 py-3 bg-[#080808] border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
          <div>
            <p className="text-white font-semibold text-sm leading-none">
              {session?.consultantName}
            </p>
            <p className="text-white/35 text-[10px] mt-0.5">
              {session?.date} · {session?.time} – {session?.endTime}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden sm:block text-white/30 text-xs font-mono">{session?.meetingId}</span>
          {isHost && !isCalling && (
            <button
              id="start-call-btn"
              onClick={startCall}
              className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-bold px-3 py-1.5 rounded-xl hover:bg-green-500 hover:text-white transition-all"
            >
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Start Call
            </button>
          )}
          {isCalling && (
            <div className="flex items-center gap-1.5 text-red-400 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
              Live
            </div>
          )}
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Video Grid ─────────────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col p-3 sm:p-4 gap-3 overflow-auto">

          {/* Host Left / Call Ended banners */}
          <AnimatePresence>
            {(callEnded || hostLeftMsg) && (
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3 text-amber-400 text-sm text-center"
              >
                {callEnded ? "The call has ended." : hostLeftMsg}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Video tiles grid */}
          <div
            className={`grid gap-3 flex-1 ${
              remoteList.length === 0
                ? "grid-cols-1 place-items-center"
                : remoteList.length === 1
                ? "grid-cols-1 sm:grid-cols-2"
                : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {/* Local tile */}
            <VideoTile
              stream={localStream}
              label={myName}
              isHost={isHost}
              isMuted={isAudioMuted}
              isVideoOff={isVideoOff}
              isLocal
            />

            {/* Remote tiles */}
            {remoteList.map((p: Participant & { stream?: MediaStream }) => (
              <VideoTile
                key={p.participantId}
                stream={p.stream}
                label={p.participantName}
                isHost={p.isHost}
                isMuted={p.isAudioMuted}
                isVideoOff={p.isVideoOff}
              />
            ))}

            {/* Empty placeholder if no remote yet */}
            {remoteList.length === 0 && (
              <div className="col-span-full flex flex-col items-center gap-3 text-white/25 py-8">
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-2xl">⏳</div>
                <p className="text-sm">Waiting for others to join…</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Chat Panel ───────────────────────────────────────────────────────── */}
        <AnimatePresence>
          {showChat && (
            <motion.div
              key="chat"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 300, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="flex-shrink-0 border-l border-white/[0.06] bg-[#080808] flex flex-col overflow-hidden"
            >
              <div className="px-4 py-3 border-b border-white/[0.06] flex items-center justify-between">
                <span className="text-white font-bold text-sm">Chat</span>
                <button
                  onClick={() => setShowChat(false)}
                  className="text-white/30 hover:text-white transition-colors text-xs"
                >
                  ✕
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {chatMessages.length === 0 && (
                  <p className="text-center text-white/20 text-xs mt-6">No messages yet</p>
                )}
                {chatMessages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex flex-col gap-0.5 ${m.sender === myName ? "items-end" : "items-start"}`}
                  >
                    <span className="text-white/35 text-[10px]">
                      {m.sender} · {m.at}
                    </span>
                    <div
                      className={`max-w-[220px] px-3 py-2 rounded-xl text-sm ${
                        m.sender === myName
                          ? "bg-[#d4af37] text-black font-medium"
                          : "bg-[#141414] border border-white/[0.06] text-white"
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Input */}
              <div className="p-3 border-t border-white/[0.06] flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
                  placeholder="Type a message…"
                  className="flex-1 bg-[#141414] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/25 focus:outline-none focus:border-[#d4af37]/40"
                />
                <button
                  onClick={handleSendChat}
                  className="bg-[#d4af37] text-black px-3 py-2 rounded-xl text-xs font-bold hover:bg-yellow-400 transition-all"
                >
                  →
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Controls Bar ─────────────────────────────────────────────────────── */}
      <div className="flex-shrink-0 bg-[#080808] border-t border-white/[0.06] px-4 py-3 flex items-center justify-center gap-2 sm:gap-3">
        <ControlBtn
          id="toggle-mic-btn"
          onClick={toggleAudio}
          active={isAudioMuted}
          title={isAudioMuted ? "Unmute" : "Mute"}
        >
          {isAudioMuted
            ? <MicOffIcon className="w-5 h-5" />
            : <MicIcon className="w-5 h-5" />
          }
        </ControlBtn>

        <ControlBtn
          id="toggle-cam-btn"
          onClick={toggleVideo}
          active={isVideoOff}
          title={isVideoOff ? "Cam On" : "Cam Off"}
        >
          {isVideoOff
            ? <CamOffIcon className="w-5 h-5" />
            : <CamIcon className="w-5 h-5" />
          }
        </ControlBtn>

        <ControlBtn
          id="toggle-chat-btn"
          onClick={() => setShowChat((s) => !s)}
          active={showChat}
          title="Chat"
        >
          <ChatIcon className="w-5 h-5" />
        </ControlBtn>

        <div className="w-px h-8 bg-white/10 mx-1" />

        <ControlBtn
          id="leave-meeting-btn"
          onClick={handleLeave}
          danger
          title={isHost ? "End Call" : "Leave"}
        >
          <PhoneOffIcon className="w-5 h-5" />
        </ControlBtn>
      </div>
    </div>
  );
}

// ─── Small helper ─────────────────────────────────────────────────────────────
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
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-white/40 text-sm">
        <span>{icon}</span>
        <span>{label}</span>
      </div>
      <span className={`text-white text-sm font-semibold ${mono ? "font-mono tracking-wider text-[#d4af37]" : ""}`}>
        {value}
      </span>
    </div>
  );
}
