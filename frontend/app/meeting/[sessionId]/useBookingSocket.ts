"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001";

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
  refreshKey?: number;
}

interface UseBookingSocketReturn {
  socket: Socket | null;
  remoteParticipants: Map<string, Participant & { stream?: MediaStream }>;
  isCalling: boolean;
  startCall: () => void;
  endCall: () => void;
  sendChatMessage: (msg: object) => void;
  updateMyState: (isAudioMuted: boolean, isVideoOff: boolean) => void;
  isConnected: boolean;
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
  refreshKey = 0,
}: UseBookingSocketOptions): UseBookingSocketReturn {
  const socketRef = useRef<Socket | null>(null);
  const peerConnectionsRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const [remoteParticipants, setRemoteParticipants] = useState<
    Map<string, Participant & { stream?: MediaStream }>
  >(new Map());
  const [isCalling, setIsCalling] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const iceServers: RTCIceServer[] = [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" },
    { urls: "stun:stun3.l.google.com:19302" },
    { urls: "stun:stun4.l.google.com:19302" },
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
        const remoteStream = event.streams[0];
        if (!remoteStream) return;

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

    const socket = io(SOCKET_URL);
    socketRef.current = socket;

    // ── Join meeting room ───────────────────────────────────────────────
    const joinData = {
      meetingId,
      participantId,
      participantName,
      isHost,
      sessionId,
    };

    socket.on("connect", () => {
      console.log("Socket connected!");
      setIsConnected(true);
      socket.emit("join-meeting", joinData);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
      setIsConnected(false);
    });

    // If socket is already connected when listeners are attached
    if (socket.connected) {
      setIsConnected(true);
      socket.emit("join-meeting", joinData);
    }

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
          
          // Only initiate offer if the call has already started
          // If not, we wait for the call-started event or isCalling to become true
          if (isCalling) {
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
      }
    );

    // ── New participant joined ──────────────────────────────────────────
    socket.on(
      "participant-joined",
      async (p: { participantId: string; participantName: string; isHost: boolean }) => {
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

        // Simply create the peer connection record
        // We will only offer if we ARE already calling.
        // If we are host and call hasn't started, we won't offer yet.
        const pc = createPeerConnection(p.participantId);
        
        if (isCalling) {
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
        let pc = peerConnectionsRef.current.get(fromParticipantId);
        if (!pc) {
          pc = createPeerConnection(fromParticipantId);
        }
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
    }, [meetingId, participantId, participantName, isHost, sessionId, localStream, createPeerConnection, onCallStarted, onCallEnded, onHostLeft, refreshKey]); // Remove isCalling from here!

  // ─── Trigger offers when call starts ──────────────────────────────────
  useEffect(() => {
    if (isCalling && socketRef.current) {
      // If the call just started, and we have remote participants with no active peer connection or tracks, send offers.
      // This is primarily for the Host when they click "Start".
      remoteParticipants.forEach(async (p, pid) => {
        let pc = peerConnectionsRef.current.get(pid);
        if (!pc) {
          pc = createPeerConnection(pid);
        }
        
        // If we haven't sent an offer yet (check signaling state)
        if (pc.signalingState === "stable") {
           const offer = await pc.createOffer();
           await pc.setLocalDescription(offer);
           socketRef.current?.emit("offer", {
             meetingId,
             toParticipantId: pid,
             offer,
           });
        }
      });
    }
  }, [isCalling, remoteParticipants, meetingId, createPeerConnection]);

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
    isConnected,
  };
}
