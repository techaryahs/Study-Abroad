"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { getUser } from "@/app/lib/token";
import { useBookingSocket, Participant } from "./useBookingSocket";

import VideoTile from "@/components/meeting/VideoTile";
import Controls from "@/components/meeting/Controls";
import ChatPanel, { ChatMessage } from "@/components/meeting/ChatPanel";
import PreJoin from "@/components/meeting/PreJoin";

// ─── Types ────────────────────────────────────────────────────────────────────
interface SessionData {
  sessionId: string;
  meetingId: string;
  date: string;
  time: string;
  endTime: string;
  consultantName: string;
  consultantEmail?: string;
  userName?: string;
  userEmail: string;
  status: string;
}

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL &&
  process.env.NEXT_PUBLIC_BACKEND_URL !== "undefined"
    ? process.env.NEXT_PUBLIC_BACKEND_URL
    : "http://localhost:5001";

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
  const [myId] = useState(
    () => `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
  );
  const [myName, setMyName] = useState("You");
  const [isHost, setIsHost] = useState(false);

  // Local media
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [mediaError, setMediaError] = useState("");

  // UI state
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [callEnded, setCallEnded] = useState(false);
  const [hostLeftMsg, setHostLeftMsg] = useState("");
  const [setupDone, setSetupDone] = useState(false);
  const [autoEndCountdown, setAutoEndCountdown] = useState<number | null>(null); // seconds remaining
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // ── Fetch session ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!sessionId) return;

    fetch(`${BACKEND_URL}/api/bookings/session/${sessionId}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.session) {
          setSession(d.session);
        } else if (d.sessionId) {
          setSession(d);
        } else {
          setSessionError("Session not found. Please check your meeting link.");
        }
      })
      .catch(() => setSessionError("Could not connect to server."))
      .finally(() => setLoading(false));
  }, [sessionId]);

  // ── Resolve identity & check video access ─────────────────────────────
  useEffect(() => {
    if (!session) return;
    
    const user = getUser();
    if (!user) return;

    setMyName(user.name || user.email || "You");

    // Host = anyone with admin role (regardless of consultantName string)
    setIsHost(user.role === "admin");
  }, [session]);

  // ── Acquire camera/mic ────────────────────────────────────────────────
  const acquireMedia = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalStream(stream);
      setSetupDone(true);
    } catch {
      setMediaError(
        "Camera / microphone access denied. Please allow access and refresh."
      );
    }
  }, []);

  // ── WebRTC + Socket hook ──────────────────────────────────────────────
  const {
    remoteParticipants,
    isCalling,
    startCall,
    endCall,
    sendChatMessage,
    updateMyState,
    socket,
    isConnected,
  } = useBookingSocket({
    sessionId,
    meetingId: session?.meetingId ?? "",
    participantId: myId,
    participantName: myName,
    isHost,
    localStream: setupDone ? localStream : null,
    onCallStarted: useCallback(() => {}, []),
    onCallEnded: useCallback(() => setCallEnded(true), []),
    onHostLeft: useCallback(() => setHostLeftMsg("The counsellor has left the session."), []),
    refreshKey,
  });

  // ── Receive chat from socket ──────────────────────────────────────────
  useEffect(() => {
    if (!socket) return;
    const handleChat = (message: ChatMessage) => {
      setChatMessages((prev) => [...prev, message]);
    };
    socket.on("chat-message", handleChat);
    return () => { socket.off("chat-message", handleChat); };
  }, [socket]);

  // ── Auto-end countdown & force-end listeners ──────────────────────────
  useEffect(() => {
    if (!socket) return;

    const handleAutoEndStarted = (data: { autoEndMinutes: number }) => {
      const totalSeconds = data.autoEndMinutes * 60;
      setAutoEndCountdown(totalSeconds);
      setHostLeftMsg(`Host left. Meeting will auto-end in ${data.autoEndMinutes} minutes.`);

      // Start countdown
      if (countdownRef.current) clearInterval(countdownRef.current);
      countdownRef.current = setInterval(() => {
        setAutoEndCountdown((prev) => {
          if (prev === null || prev <= 1) {
            if (countdownRef.current) clearInterval(countdownRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    };

    const handleHostRejoined = () => {
      // Cancel countdown
      if (countdownRef.current) clearInterval(countdownRef.current);
      setAutoEndCountdown(null);
      setHostLeftMsg("");
    };

    const handleForceEnded = () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
      setAutoEndCountdown(null);
      setCallEnded(true);
      setHostLeftMsg("The counsellor has ended this session.");
      // Auto-redirect after 3 seconds
      setTimeout(() => {
        localStream?.getTracks().forEach((t) => t.stop());
        const currentUser = getUser();
        const userIsAdmin = currentUser?.role === "admin";
        router.push(userIsAdmin ? "/admin-dashboard" : "/User/dashboard");
      }, 3000);
    };

    const handleAutoEnded = () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
      setAutoEndCountdown(0);
      setCallEnded(true);
      setHostLeftMsg("Meeting auto-ended. The host did not return.");
      setTimeout(() => {
        localStream?.getTracks().forEach((t) => t.stop());
        const currentUser = getUser();
        const userIsAdmin = currentUser?.role === "admin";
        router.push(userIsAdmin ? "/admin-dashboard" : "/User/dashboard");
      }, 4000);
    };

    socket.on("auto-end-started", handleAutoEndStarted);
    socket.on("host-rejoined", handleHostRejoined);
    socket.on("meeting-force-ended", handleForceEnded);
    socket.on("meeting-auto-ended", handleAutoEnded);

    return () => {
      socket.off("auto-end-started", handleAutoEndStarted);
      socket.off("host-rejoined", handleHostRejoined);
      socket.off("meeting-force-ended", handleForceEnded);
      socket.off("meeting-auto-ended", handleAutoEnded);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [socket, localStream, router]);

  // ── Controls ──────────────────────────────────────────────────────────
  const toggleAudio = () => {
    if (!localStream) return;
    const newMuted = !isAudioMuted;
    localStream.getAudioTracks().forEach((t) => (t.enabled = !newMuted));
    setIsAudioMuted(newMuted);
    updateMyState(newMuted, isVideoOff);
  };

  const toggleVideo = () => {
    if (!localStream) return;
    const newOff = !isVideoOff;
    localStream.getVideoTracks().forEach((t) => (t.enabled = !newOff));
    setIsVideoOff(newOff);
    updateMyState(isAudioMuted, newOff);
  };

  const handleLeave = () => {
    // Re-read role directly from storage to avoid stale isHost state
    const currentUser = getUser();
    const userIsAdmin = currentUser?.role === "admin";
    if (userIsAdmin) endCall();
    localStream?.getTracks().forEach((t) => t.stop());
    router.push(userIsAdmin ? "/admin-dashboard" : "/User/dashboard");
  };

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
  
  const handleRepair = () => {
    setRefreshKey(prev => prev + 1);
  };

  const remoteList = Array.from(remoteParticipants.values());

  // ─── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#050505] flex items-center justify-center z-[9999]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-[#d4af37]/30 border-t-[#d4af37] animate-spin" />
          <p className="text-white/30 text-sm">Loading session…</p>
        </div>
      </div>
    );
  }

  // ─── Error ────────────────────────────────────────────────────────────────
  if (sessionError) {
    return (
      <div className="fixed inset-0 bg-[#050505] flex items-center justify-center p-4 z-[9999]">
        <div className="max-w-sm text-center space-y-5">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-3xl">
            🔒
          </div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight">
            Access Denied
          </h1>
          <p className="text-white/35 text-sm leading-relaxed">{sessionError}</p>
          <button
            onClick={() => router.push("/User/dashboard")}
            className="px-6 py-3 bg-[#d4af37] text-black font-bold rounded-xl hover:bg-yellow-400 transition-all text-sm uppercase tracking-wider"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // ─── Pre-join ─────────────────────────────────────────────────────────────
  if (!setupDone) {
    return (
      <PreJoin
        session={session}
        myName={myName}
        isHost={isHost}
        mediaError={mediaError}
        onNameChange={setMyName}
        onJoin={acquireMedia}
      />
    );
  }

  // ─── Meeting Room ─────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 bg-[#050505] flex flex-col overflow-hidden z-[9999] selection:bg-[#d4af37]/20">

      {/* Top Bar */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 sm:px-6 py-3 bg-[#080808]/95 backdrop-blur-xl border-b border-white/[0.06] z-10">
        <div className="flex items-center gap-3">
          {isConnected ? (
            <span className="w-2.5 h-2.5 rounded-full bg-green-400/60 flex-shrink-0" title="Connected to server" />
          ) : (
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse flex-shrink-0" title="Connecting..." />
          )}
          <div>
            <p className="text-white font-semibold text-sm leading-none">
              {session?.consultantName}
            </p>
            <p className="text-white/30 text-[14px] font-bold mt-0.5">
              {session?.date} · {session?.time} – {session?.endTime}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:block text-white/20 text-[14px] font-bold font-mono">
            {session?.meetingId}
          </span>
          {isHost && (
            <span className="text-[13px] font-bold font-black uppercase tracking-widest text-[#d4af37] bg-[#d4af37]/10 border border-[#d4af37]/20 px-2 py-1 rounded-lg">
              Host
            </span>
          )}
          {isCalling && (
            <div className="flex items-center gap-1.5 text-red-400 text-xs font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
              Live
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden relative">
        <div className="flex-1 flex flex-col min-w-0 bg-[#050505] p-2 md:p-6 overflow-hidden">
          {/* Main Grid Container */}
          <div 
            className={`
              grid gap-4 w-full h-full mx-auto transition-all duration-500
              ${
                remoteList.length === 0
                  ? "max-w-4xl grid-cols-1 place-items-center"
                  : remoteList.length === 1
                  ? "max-w-6xl grid-cols-1 md:grid-cols-2"
                  : remoteList.length === 2
                  ? "max-w-7xl grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              }
            `}
          >
            {/* Local Video */}
            <div className={`w-full h-full ${remoteList.length === 0 ? "aspect-video max-h-[70vh]" : ""}`}>
              <VideoTile
                stream={localStream}
                label={myName}
                isHost={isHost}
                isMuted={isAudioMuted}
                isVideoOff={isVideoOff}
                isLocal
              />
            </div>

            {/* Remote Videos */}
            {remoteList.map((p: Participant & { stream?: MediaStream }) => (
              <div key={p.participantId} className="w-full h-full">
                <VideoTile
                  stream={p.stream}
                  label={p.participantName}
                  isHost={p.isHost}
                  isMuted={p.isAudioMuted}
                  isVideoOff={p.isVideoOff}
                />
              </div>
            ))}
          </div>

          {/* Overlay Banners */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-xl px-4 pointer-events-none">
            <AnimatePresence>
              {(callEnded || hostLeftMsg || autoEndCountdown !== null) && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-3"
                >
                  {(callEnded || hostLeftMsg) && (
                    <div className="bg-amber-500/10 backdrop-blur-xl border border-amber-500/20 rounded-2xl px-6 py-4 flex items-center gap-4 shadow-2xl">
                      <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500">
                        ⚠️
                      </div>
                      <p className="text-amber-200 text-sm font-medium">
                        {callEnded ? "Session ended." : hostLeftMsg}
                      </p>
                    </div>
                  )}

                  {autoEndCountdown !== null && autoEndCountdown > 0 && !callEnded && (
                    <div className="bg-red-500/10 backdrop-blur-xl border border-red-500/20 rounded-2xl px-6 py-4 flex items-center justify-between shadow-2xl">
                       <div className="flex items-center gap-4">
                          <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                          <p className="text-red-200 text-sm font-bold uppercase tracking-wider">Host left · Ending in</p>
                       </div>
                       <span className="text-red-500 font-mono text-xl font-black tabular-nums">
                          {String(Math.floor(autoEndCountdown / 60)).padStart(2, "0")}:{String(autoEndCountdown % 60).padStart(2, "0")}
                       </span>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Chat Panel */}
        {showChat && (
          <ChatPanel
            messages={chatMessages}
            myName={myName}
            chatInput={chatInput}
            onInputChange={setChatInput}
            onSend={handleSendChat}
            onClose={() => setShowChat(false)}
          />
        )}
      </div>

      {/* Controls */}
      <Controls
        isAudioMuted={isAudioMuted}
        isVideoOff={isVideoOff}
        showChat={showChat}
        isHost={isHost}
        isCalling={isCalling}
        onToggleAudio={toggleAudio}
        onToggleVideo={toggleVideo}
        onToggleChat={() => setShowChat((s) => !s)}
        onStartCall={startCall}
        onLeave={handleLeave}
        onRepair={handleRepair}
      />
    </div>
  );
}
