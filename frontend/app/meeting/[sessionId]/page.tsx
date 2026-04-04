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
  const videoAccessChecked = useRef(false);

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

    // Role-based host identification: consultant role + email matches booking
    const byRole = user.role === "consultant";
    const byEmail =
      session.consultantEmail &&
      user.email?.toLowerCase() === session.consultantEmail.toLowerCase();
    setIsHost(byRole || !!byEmail);

    // Check if consultant has video access enabled (only once)
    if (!videoAccessChecked.current && (session as any).consultantVideoEnabled === false) {
      videoAccessChecked.current = true;
      setSessionError("Video calls are not available for this consultant. This is a booking-only session.");
      setTimeout(() => {
        if (user.role === "consultant") {
          router.push("/consultant-dashboard");
        } else {
          router.push("/");
        }
      }, 3000);
    }
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
  } = useBookingSocket({
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

  // ── Receive chat from socket ──────────────────────────────────────────
  useEffect(() => {
    if (!socket) return;
    const handleChat = (data: { message: ChatMessage }) => {
      setChatMessages((prev) => [...prev, data.message]);
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
        router.push("/User/dashboard");
      }, 3000);
    };

    const handleAutoEnded = () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
      setAutoEndCountdown(0);
      setCallEnded(true);
      setHostLeftMsg("Meeting auto-ended. The host did not return.");
      setTimeout(() => {
        localStream?.getTracks().forEach((t) => t.stop());
        router.push("/User/dashboard");
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
    if (isHost) endCall();
    localStream?.getTracks().forEach((t) => t.stop());
    router.push(isHost ? "/consultant-dashboard" : "/User/dashboard");
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

  const remoteList = Array.from(remoteParticipants.values());

  // ─── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
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
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
        <div className="max-w-sm text-center space-y-5">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-3xl">
            🔒
          </div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight">
            Access Denied
          </h1>
          <p className="text-white/35 text-sm leading-relaxed">{sessionError}</p>
          <button
            onClick={() => router.push("/services")}
            className="px-6 py-3 bg-[#d4af37] text-black font-bold rounded-xl hover:bg-yellow-400 transition-all text-sm uppercase tracking-wider"
          >
            Back to Services
          </button>
        </div>
      </div>
    );
  }

  // ─── Check video access before allowing entry ─────────────────────────────
  if (session && (session as any).consultantVideoEnabled === false && !loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
        <div className="max-w-md text-center space-y-5">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-3xl">
            📵
          </div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight">
            Video Calls Not Available
          </h1>
          <p className="text-white/35 text-sm leading-relaxed">
            This consultant does not have video call access enabled. This is a booking-only session. 
            The consultant will contact you via email.
          </p>
          <button
            onClick={() => {
              const user = getUser();
              if (user?.role === "consultant") {
                router.push("/consultant-dashboard");
              } else {
                router.push("/services");
              }
            }}
            className="px-6 py-3 bg-[#d4af37] text-black font-bold rounded-xl hover:bg-yellow-400 transition-all text-sm uppercase tracking-wider"
          >
            Go Back
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
    <div className="min-h-screen bg-[#050505] flex flex-col overflow-hidden">

      {/* Top Bar */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 sm:px-6 py-3 bg-[#080808]/95 backdrop-blur-xl border-b border-white/[0.06] z-10">
        <div className="flex items-center gap-3">
          {isCalling ? (
            <span className="w-2.5 h-2.5 rounded-full bg-red-400 animate-pulse flex-shrink-0" />
          ) : (
            <span className="w-2.5 h-2.5 rounded-full bg-green-400/60 flex-shrink-0" />
          )}
          <div>
            <p className="text-white font-semibold text-sm leading-none">
              {session?.consultantName}
            </p>
            <p className="text-white/30 text-[10px] mt-0.5">
              {session?.date} · {session?.time} – {session?.endTime}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:block text-white/20 text-[10px] font-mono">
            {session?.meetingId}
          </span>
          {isHost && (
            <span className="text-[9px] font-black uppercase tracking-widest text-[#d4af37] bg-[#d4af37]/10 border border-[#d4af37]/20 px-2 py-1 rounded-lg">
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
      <div className="flex flex-1 overflow-hidden">
        {/* Video Grid */}
        <div className="flex-1 flex flex-col p-3 sm:p-4 gap-3 overflow-auto">

          {/* Banners */}
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

          {/* Auto-end countdown timer */}
          {autoEndCountdown !== null && autoEndCountdown > 0 && !callEnded && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-500/10 border border-red-500/25 rounded-xl px-5 py-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-400 animate-pulse" />
                <div>
                  <p className="text-red-400 text-sm font-bold">Host has left — session will auto-end</p>
                  <p className="text-red-400/50 text-xs mt-0.5">The counsellor can rejoin to cancel the timer</p>
                </div>
              </div>
              <div className="bg-red-500/20 border border-red-500/30 rounded-xl px-4 py-2 text-center">
                <p className="text-red-400 text-xl font-mono font-black tabular-nums tracking-wider">
                  {String(Math.floor(autoEndCountdown / 60)).padStart(2, "0")}:{String(autoEndCountdown % 60).padStart(2, "0")}
                </p>
                <p className="text-red-400/40 text-[8px] uppercase tracking-widest font-bold">remaining</p>
              </div>
            </motion.div>
          )}

          {/* Tiles */}
          <div
            className={`grid gap-3 flex-1 ${
              remoteList.length === 0
                ? "grid-cols-1 max-w-2xl mx-auto w-full"
                : remoteList.length === 1
                ? "grid-cols-1 sm:grid-cols-2"
                : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {/* Local */}
            <VideoTile
              stream={localStream}
              label={myName}
              isHost={isHost}
              isMuted={isAudioMuted}
              isVideoOff={isVideoOff}
              isLocal
            />

            {/* Remote */}
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

            {/* Waiting placeholder */}
            {remoteList.length === 0 && (
              <div className="flex flex-col items-center gap-3 text-white/20 py-12">
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <p className="text-sm">Waiting for others to join…</p>
              </div>
            )}
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
      />
    </div>
  );
}
