"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

export interface Participant {
  participantId: string;
  participantName: string;
  isHost: boolean;
  stream?: MediaStream;
  isAudioMuted: boolean;
  isVideoOff: boolean;
}

interface UseBookingSocketOptions {
  sessionId: string;
  meetingId: string;
  participantId: string;
  participantName: string;
  isHost: boolean;
  localStream: MediaStream | null;
  onCallStarted?: (info: { sessionId: string; meetingId: string; hostName: string }) => void;
  onCallEnded?: () => void;
  onHostLeft?: () => void;
}

interface UseBookingSocketReturn {
  socket: Socket | null;
  remoteParticipants: Map<string, Participant & { stream?: MediaStream }>;
  isCalling: boolean;
  startCall: () => void;
  endCall: () => void;
  sendChatMessage: (msg: object) => void;
  updateMyState: (isAudioMuted: boolean, isVideoOff: boolean) => void;
}

export function useBookingSocket({
  sessionId,
  meetingId,
  participantId,
  participantName,
  isHost,
  localStream,
  onCallStarted,
  onCallEnded,
  onHostLeft,
}: UseBookingSocketOptions): UseBookingSocketReturn {
  const socketRef = useRef<Socket | null>(null);
  const peerConnectionsRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const [remoteParticipants, setRemoteParticipants] = useState<
    Map<string, Participant & { stream?: MediaStream }>
  >(new Map());
  const [isCalling, setIsCalling] = useState(false);

  const iceServers: RTCIceServer[] = [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ];

  // ─── Create RTCPeerConnection for a participant ────────────────────────
  const createPeerConnection = useCallback(
    (remoteParticipantId: string): RTCPeerConnection => {
      const pc = new RTCPeerConnection({ iceServers });

      if (localStream) {
        localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));
      }

      pc.onicecandidate = (event) => {
        if (event.candidate && socketRef.current) {
          socketRef.current.emit("ice-candidate", {
            meetingId,
            toParticipantId: remoteParticipantId,
            candidate: event.candidate,
          });
        }
      };

      pc.ontrack = (event) => {
        const [remoteStream] = event.streams;
        setRemoteParticipants((prev) => {
          const next = new Map(prev);
          const existing = next.get(remoteParticipantId);
          if (existing) {
            next.set(remoteParticipantId, { ...existing, stream: remoteStream });
          }
          return next;
        });
      };

      pc.onconnectionstatechange = () => {
        if (
          pc.connectionState === "disconnected" ||
          pc.connectionState === "failed"
        ) {
          peerConnectionsRef.current.delete(remoteParticipantId);
        }
      };

      peerConnectionsRef.current.set(remoteParticipantId, pc);
      return pc;
    },
    [localStream, meetingId] // eslint-disable-line react-hooks/exhaustive-deps
  );

  // ─── Socket setup ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!meetingId || !participantId) return;

    const socket = io(SOCKET_URL, { transports: ["websocket"] });
    socketRef.current = socket;

    // ── Join meeting room ───────────────────────────────────────────────
    socket.on("connect", () => {
      socket.emit("join-meeting", {
        meetingId,
        participantId,
        participantName,
        isHost,
        sessionId,
      });
    });

    // ── Existing participants (sent when we first join) ─────────────────
    socket.on(
      "existing-participants",
      async (
        participants: Array<{
          participantId: string;
          participantName: string;
          isHost: boolean;
          isAudioMuted: boolean;
          isVideoOff: boolean;
        }>
      ) => {
        for (const p of participants) {
          setRemoteParticipants((prev) => {
            const next = new Map(prev);
            next.set(p.participantId, {
              ...p,
              stream: undefined,
            });
            return next;
          });
          // As new joiner, initiate offer to each existing participant
          const pc = createPeerConnection(p.participantId);
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          socket.emit("offer", {
            meetingId,
            toParticipantId: p.participantId,
            offer,
          });
        }
      }
    );

    // ── New participant joined ──────────────────────────────────────────
    socket.on(
      "participant-joined",
      (p: { participantId: string; participantName: string; isHost: boolean }) => {
        setRemoteParticipants((prev) => {
          const next = new Map(prev);
          next.set(p.participantId, {
            ...p,
            stream: undefined,
            isAudioMuted: false,
            isVideoOff: false,
          });
          return next;
        });
      }
    );

    // ── Incoming offer (from someone who joined after us) ───────────────
    socket.on(
      "offer",
      async ({
        fromParticipantId,
        offer,
      }: {
        fromParticipantId: string;
        fromParticipantName: string;
        offer: RTCSessionDescriptionInit;
      }) => {
        const pc = createPeerConnection(fromParticipantId);
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit("answer", {
          meetingId,
          toParticipantId: fromParticipantId,
          answer,
        });
      }
    );

    // ── Incoming answer ─────────────────────────────────────────────────
    socket.on(
      "answer",
      async ({
        fromParticipantId,
        answer,
      }: {
        fromParticipantId: string;
        answer: RTCSessionDescriptionInit;
      }) => {
        const pc = peerConnectionsRef.current.get(fromParticipantId);
        if (pc) {
          await pc.setRemoteDescription(new RTCSessionDescription(answer));
        }
      }
    );

    // ── ICE candidates ──────────────────────────────────────────────────
    socket.on(
      "ice-candidate",
      async ({
        fromParticipantId,
        candidate,
      }: {
        fromParticipantId: string;
        candidate: RTCIceCandidateInit;
      }) => {
        const pc = peerConnectionsRef.current.get(fromParticipantId);
        if (pc) {
          try {
            await pc.addIceCandidate(new RTCIceCandidate(candidate));
          } catch (e) {
            console.warn("[ICE] Failed to add candidate:", e);
          }
        }
      }
    );

    // ── Call started ────────────────────────────────────────────────────
    socket.on(
      "call-started",
      (info: { sessionId: string; meetingId: string; hostName: string }) => {
        setIsCalling(true);
        onCallStarted?.(info);
      }
    );

    // ── Call ended ──────────────────────────────────────────────────────
    socket.on("call-ended", () => {
      setIsCalling(false);
      onCallEnded?.();
    });

    // ── Participant state changed (mute/video) ──────────────────────────
    socket.on(
      "participant-state-changed",
      ({
        participantId: pid,
        isAudioMuted,
        isVideoOff,
      }: {
        participantId: string;
        participantName: string;
        isAudioMuted: boolean;
        isVideoOff: boolean;
      }) => {
        setRemoteParticipants((prev) => {
          const next = new Map(prev);
          const p = next.get(pid);
          if (p) next.set(pid, { ...p, isAudioMuted, isVideoOff });
          return next;
        });
      }
    );

    // ── Participant left ────────────────────────────────────────────────
    socket.on(
      "participant-left",
      ({ participantId: pid }: { participantId: string; participantName: string }) => {
        peerConnectionsRef.current.get(pid)?.close();
        peerConnectionsRef.current.delete(pid);
        setRemoteParticipants((prev) => {
          const next = new Map(prev);
          next.delete(pid);
          return next;
        });
      }
    );

    // ── Host left ──────────────────────────────────────────────────────
    socket.on("host-left", () => {
      onHostLeft?.();
    });

    return () => {
      // Cleanup
      socket.emit("leave-meeting", { meetingId, participantId });
      peerConnectionsRef.current.forEach((pc) => pc.close());
      peerConnectionsRef.current.clear();
      socket.disconnect();
      socketRef.current = null;
    };
  }, [meetingId, participantId, participantName, isHost, sessionId]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Host: start call ─────────────────────────────────────────────────
  const startCall = useCallback(() => {
    if (!socketRef.current || !isHost) return;
    socketRef.current.emit("start-call", {
      sessionId,
      meetingId,
      hostName: participantName,
      duration: 60,
    });
    setIsCalling(true);
  }, [sessionId, meetingId, participantName, isHost]);

  // ─── End call ─────────────────────────────────────────────────────────
  const endCall = useCallback(() => {
    if (!socketRef.current) return;
    socketRef.current.emit("end-call", { sessionId });
    setIsCalling(false);
  }, [sessionId]);

  // ─── Send chat message ─────────────────────────────────────────────────
  const sendChatMessage = useCallback(
    (msg: object) => {
      socketRef.current?.emit("chat-message", { meetingId, message: msg });
    },
    [meetingId]
  );

  // ─── Update local mute/video state to peers ───────────────────────────
  const updateMyState = useCallback(
    (isAudioMuted: boolean, isVideoOff: boolean) => {
      socketRef.current?.emit("update-participant-state", {
        meetingId,
        participantId,
        isAudioMuted,
        isVideoOff,
      });
    },
    [meetingId, participantId]
  );

  return {
    socket: socketRef.current,
    remoteParticipants,
    isCalling,
    startCall,
    endCall,
    sendChatMessage,
    updateMyState,
  };
}
