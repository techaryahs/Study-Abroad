import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_webrtc/flutter_webrtc.dart';
import 'package:socket_io_client/socket_io_client.dart' as io;
import 'package:permission_handler/permission_handler.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../core/api_client.dart';
import '../../core/theme.dart';
import '../auth/auth_provider.dart';

class MeetingScreen extends StatefulWidget {
  final String sessionId;
  final Map<String, dynamic>? sessionData;
  
  const MeetingScreen({super.key, required this.sessionId, this.sessionData});

  @override
  State<MeetingScreen> createState() => _MeetingScreenState();
}

class _MeetingScreenState extends State<MeetingScreen> {
  // WebRTC
  final RTCVideoRenderer _localRenderer = RTCVideoRenderer();
  final Map<String, RTCVideoRenderer> _remoteRenderers = {};
  MediaStream? _localStream;
  final Map<String, RTCPeerConnection> _peerConnections = {};
  
  // Socket
  io.Socket? _socket;
  bool _isConnected = false;
  bool _isCalling = false;
  
  // State
  bool _setupDone = false;
  bool _isAudioMuted = false;
  bool _isVideoOff = false;
  bool _showChat = false;
  String _sessionError = "";
  bool _loading = true;
  Map<String, dynamic>? _sessionData;
  String? _myParticipantId;
  bool _advisorJoined = false;
  bool _remoteWebRTCConnected = false;
  final Set<String> _joinedParticipants = {};
  final Map<String, String> _participantNames = {};
  final Map<String, bool> _remoteVideoOff = {};
  final Map<String, bool> _remoteAudioMuted = {};
  
  // Chat
  final List<Map<String, dynamic>> _messages = [];
  final TextEditingController _chatController = TextEditingController();

  @override
  void initState() {
    super.initState();
    if (widget.sessionData != null) {
      // Create a mutable copy and ensure meetingId is set
      _sessionData = Map<String, dynamic>.from(widget.sessionData!);
      _sessionData!['meetingId'] ??= widget.sessionId;
      _loading = false;
    }
    _myParticipantId = 'user-${DateTime.now().millisecondsSinceEpoch}';
    _initRenderers();
    _fetchSessionAndConnect();
  }

  Future<void> _initRenderers() async {
    await _localRenderer.initialize();
  }

  Future<void> _fetchSessionAndConnect() async {
    try {
      final res = await ApiClient.instance.get('/api/bookings/session/${widget.sessionId}');
      final data = res.data;

      if (data != null && (data['session'] != null || data['sessionId'] != null || data['meetingId'] != null)) {
        setState(() {
          final session = data['session'] ?? data;
          _sessionData = session is Map ? Map<String, dynamic>.from(session) : null;
          // Ensure meetingId exists — fall back to sessionId itself
          if (_sessionData != null && _sessionData!['meetingId'] == null) {
            _sessionData!['meetingId'] = widget.sessionId;
          }
          _loading = false;
        });
      } else {
        // Fallback: use sessionId as meetingId so the call still works
        setState(() {
          _sessionData = {'meetingId': widget.sessionId, 'sessionId': widget.sessionId};
          _loading = false;
        });
      }
    } catch (e) {
      debugPrint("Session fetch error: $e");
      // Fallback: only use fallback if we don't already have data from the dashboard
      if (_sessionData == null) {
        setState(() {
          _sessionData = {'meetingId': widget.sessionId, 'sessionId': widget.sessionId};
          _loading = false;
        });
      } else {
        setState(() => _loading = false);
      }
    }
  }

  Future<void> _joinMeeting() async {
    debugPrint("Join Meeting Pressed");
    final cam = await Permission.camera.request();
    final mic = await Permission.microphone.request();

    if (cam.isGranted && mic.isGranted) {
      try {
        final Map<String, dynamic> constraints = {
          'audio': true,
          'video': {
            'facingMode': 'user',
            'width': {'ideal': 640},
            'height': {'ideal': 480},
          },
        };
        _localStream = await navigator.mediaDevices.getUserMedia(constraints);
        if (!mounted) return;
        
        // Ensure speakerphone is on for better meeting experience
        Helper.setSpeakerphoneOn(true);
        
        _localRenderer.srcObject = _localStream;
        setState(() {
          _setupDone = true;
          _isCalling = true;
        });
        _connectSocket();
      } catch (e) {
        debugPrint("Media access error: $e");
        setState(() => _sessionError = "Media Error: Could not access camera/mic. Details: $e");
      }
    } else {
      debugPrint("Permissions denied: Cam=$cam, Mic=$mic");
      setState(() => _sessionError = "Camera and microphone permissions are mandatory for meetings. Please grant them and try again.");
    }
  }

  void _connectSocket() {
    if (!mounted) return;
    final auth = context.read<AuthProvider>();
    final user = auth.user;

    _socket = io.io(ApiClient.baseUrl, <String, dynamic>{
      'transports': ['websocket'],
      'autoConnect': false,
      'forceNew': true,
      'query': {'meetingId': _sessionData?['meetingId']},
    });

    _socket!.connect();

    _socket!.onConnect((_) {
      if (!mounted) return;
      setState(() => _isConnected = true);
      final isHost = auth.role == 'admin' || auth.role == 'consultant';
      _socket!.emit('join-meeting', {
        'meetingId': _sessionData?['meetingId'],
        'participantId': _myParticipantId,
        'participantName': user?['name'] ?? 'Guest',
        'isHost': isHost,
        'sessionId': widget.sessionId,
      });
    });

    _socket!.onDisconnect((_) => setState(() => _isConnected = false));

    _socket!.on('existing-participants', (data) async {
       final participants = data as List;
       for (var p in participants) {
         final pid = p['participantId']?.toString();
         if (pid == null) continue;
         final pName = p['participantName'] ?? 'Advisor';
         setState(() {
           _joinedParticipants.add(pid);
           _participantNames[pid] = pName;
           _remoteVideoOff[pid] = p['isVideoOff'] == true;
           _remoteAudioMuted[pid] = p['isAudioMuted'] == true;
         });
         await _createPeerConnection(pid, pName);
         if (_isCalling) _sendOffer(pid);
         if (p['isHost'] == true) {
           setState(() => _advisorJoined = true);
         }
       }
    });

    _socket!.on('participant-joined', (data) async {
       final pid = data['participantId']?.toString();
       if (pid == null) return;
       
       // Force a clear cycle to ensure the UI normalizes before a rejoin
       if (_joinedParticipants.contains(pid)) {
          _cleanupParticipant(pid);
       }

       final pName = data['participantName'] ?? 'Student';
       if (mounted) {
         setState(() {
           _joinedParticipants.add(pid);
           _participantNames[pid] = pName;
           _remoteVideoOff[pid] = data['isVideoOff'] == true;
           _remoteAudioMuted[pid] = data['isAudioMuted'] == true;
         });
       }
       await _createPeerConnection(pid, pName);
       if (data['isHost'] == true) {
          setState(() => _advisorJoined = true);
       }
    });

    _socket!.on('offer', (data) async {
       final fromId = data['fromParticipantId']?.toString();
       final offer = data['offer'];
       if (fromId == null) return;

       if (!_peerConnections.containsKey(fromId)) {
          final pName = data['fromParticipantName'] ?? 'Remote';
          setState(() {
            _joinedParticipants.add(fromId);
            _participantNames[fromId] = pName;
          });
          await _createPeerConnection(fromId, pName);
       }

       final pc = _peerConnections[fromId];
       if (pc != null) {
         await pc.setRemoteDescription(RTCSessionDescription(offer['sdp'], offer['type']));
         final answer = await pc.createAnswer();
         await pc.setLocalDescription(answer);
         _socket!.emit('answer', {
           'meetingId': _sessionData?['meetingId'],
           'toParticipantId': fromId,
           'answer': {'sdp': answer.sdp, 'type': answer.type},
         });
       }
    });

    _socket!.on('answer', (data) async {
       final fromId = data['fromParticipantId'];
       final answer = data['answer'];
       final pc = _peerConnections[fromId];
       if (pc != null) {
         await pc.setRemoteDescription(RTCSessionDescription(answer['sdp'], answer['type']));
       }
    });

    _socket!.on('ice-candidate', (data) async {
       final fromId = data['fromParticipantId'];
       final candidateData = data['candidate'];
       final pc = _peerConnections[fromId];
       if (pc != null) {
         await pc.addCandidate(RTCIceCandidate(
           candidateData['candidate'],
           candidateData['sdpMid'],
           candidateData['sdpMLineIndex'],
         ));
       }
    });

    _socket!.on('participant-left', (data) {
       final pid = data['participantId']?.toString();
       if (pid != null) {
         _cleanupParticipant(pid);
       }
    });

    _socket!.on('host-left', (data) {
       // When host leaves, we often want to clear them regardless of ID matching 
       // because there's usually only one host.
       setState(() {
         final hostIds = _participantNames.entries
           .where((e) => e.value.toLowerCase().contains('advisor') || 
                         e.value.toLowerCase().contains('admin') ||
                         e.value.toLowerCase().contains('host'))
           .map((e) => e.key)
           .toList();
         
         for (var id in hostIds) {
           _cleanupParticipant(id);
         }
       });
    });

    _socket!.on('chat-message', (msg) {
      if (mounted && msg is Map) {
        setState(() => _messages.add(Map<String, dynamic>.from(msg)));
      }
    });

    _socket!.on('participant-state-changed', (data) {
       // Refresh UI when participant toggles cam/mic
       if (mounted) setState(() {});
    });

    _socket!.on('call-started', (_) => setState(() => _isCalling = true));
    _socket!.on('call-ended', (_) => _handleHangup());
  }

  Future<RTCPeerConnection> _createPeerConnection(String remoteId, String name) async {
    final Map<String, dynamic> config = {
      'iceServers': [
        {'urls': 'stun:stun.l.google.com:19302'},
        {'urls': 'stun:stun1.l.google.com:19302'},
        {'urls': 'stun:stun2.l.google.com:19302'},
      ]
    };
    final RTCPeerConnection pc = await createPeerConnection(config);
    _localStream?.getTracks().forEach((track) => pc.addTrack(track, _localStream!));
    pc.onIceCandidate = (candidate) => _socket?.emit('ice-candidate', {
        'meetingId': _sessionData?['meetingId'],
        'toParticipantId': remoteId,
        'candidate': {'candidate': candidate.candidate, 'sdpMid': candidate.sdpMid, 'sdpMLineIndex': candidate.sdpMLineIndex},
    });
    pc.onTrack = (event) {
      if (event.streams.isNotEmpty) _addRemoteRenderer(remoteId, event.streams[0]);
    };
    _peerConnections[remoteId] = pc;

    pc.onIceConnectionState = (state) {
      if (state == RTCIceConnectionState.RTCIceConnectionStateFailed ||
          state == RTCIceConnectionState.RTCIceConnectionStateDisconnected) {
         _cleanupParticipant(remoteId);
      }
    };
    
    return pc;
  }

  void _cleanupParticipant(String? pid) {
    if (pid == null) return;
    if (mounted) {
      setState(() {
        _joinedParticipants.remove(pid);
        _peerConnections.remove(pid)?.close();
        _remoteRenderers.remove(pid)?.dispose();
        _participantNames.remove(pid);
        _remoteVideoOff.remove(pid);
        _remoteAudioMuted.remove(pid);
      });
    }
  }

  void _addRemoteRenderer(String id, MediaStream stream) async {
    final renderer = RTCVideoRenderer();
    await renderer.initialize();
    renderer.srcObject = stream;
    renderer.onFirstFrameRendered = () {
      if (mounted) setState(() => _remoteWebRTCConnected = true);
    };
    setState(() => _remoteRenderers[id] = renderer);
  }

  Future<void> _sendOffer(String toId) async {
    final pc = _peerConnections[toId];
    if (pc == null) return;
    final offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    _socket?.emit('offer', {
      'meetingId': _sessionData?['meetingId'],
      'toParticipantId': toId,
      'offer': {'sdp': offer.sdp, 'type': offer.type},
    });
  }

  void _sendMessage() {
    if (_chatController.text.isEmpty) return;
    final msg = {
      'text': _chatController.text,
      'sender': context.read<AuthProvider>().user?['name'] ?? 'Me',
      'id': _myParticipantId,
      'at': DateTime.now().toIso8601String(),
    };
    _socket?.emit('chat-message', {
      'meetingId': _sessionData?['meetingId'],
      'message': msg
    });
    setState(() {
      _messages.add(msg);
      _chatController.clear();
    });
  }

  void _handleHangup({bool shouldPop = true}) {
    // 1. Tell the server we are leaving (triggers instant UI update for others)
    _socket?.emit('leave-meeting', {
      'meetingId': _sessionData?['meetingId'],
      'participantId': _myParticipantId,
    });
    
    // 2. Close local connections and socket
    _socket?.disconnect();
    _peerConnections.forEach((k, pc) => pc.close());
    _remoteRenderers.forEach((k, r) => r.dispose());
    
    // 3. HARD STOP for camera and mic hardware
    _localStream?.getTracks().forEach((t) {
       t.stop();
       t.enabled = false;
    });
    _localStream = null;
    _localRenderer.srcObject = null;
    _localRenderer.dispose();
    if (shouldPop && mounted) {
      context.pop();
    }
  }

  @override
  void dispose() {
    _handleHangup(shouldPop: false);
    _chatController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) return const Scaffold(backgroundColor: Colors.white, body: Center(child: CircularProgressIndicator(color: AppTheme.gold)));
    
    if (_sessionError.isNotEmpty) {
      return Scaffold(
        backgroundColor: Colors.white,
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.error_outline, color: Colors.redAccent, size: 80),
              const SizedBox(height: 24),
              Text(_sessionError, style: const TextStyle(color: AppTheme.textPrimary, fontSize: 16)),
              const SizedBox(height: 32),
              ElevatedButton(onPressed: () => context.pop(), child: const Text("CLOSE")),
            ],
          ),
        ),
      );
    }

    if (!_setupDone) return _buildPreJoin();

    return Scaffold(
      backgroundColor: Colors.white,
      body: Stack(
        children: [
          // ── MAIN VIDEO AREA ─────────────────────────────────────
          Positioned(
            top: 120, bottom: 180, left: 16, right: 16,
            child: Container(
              decoration: BoxDecoration(
                color: Colors.black,
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: Colors.white.withOpacity(0.05)),
              ),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(24),
                child: _buildVideoLayout(),
              ),
            ),
          ),
          
          // ── TOP INFO BAR (Per Image) ──────────────────────────────
          _buildTopBar(),

          // ── BOTTOM DECORATION (Per Image) ───────────────────────
          _buildBottomStatus(),

          // ── SIDE CHAT (IF OPEN) ──────────────────────────────────
          if (_showChat) _buildChatOverlay(),

          // ── BOTTOM ZOOM CONTROLS (Per Image Style) ──────────────
          if (!_showChat) _buildMeetingControls(),
        ],
      ),
    );
  }

  Widget _buildPreJoin() {
    final auth = context.read<AuthProvider>();
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(backgroundColor: Colors.transparent, elevation: 0, leading: IconButton(icon: const Icon(Icons.close, color: AppTheme.textPrimary), onPressed: () => context.pop())),
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 40),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 140, height: 140,
              padding: const EdgeInsets.all(4),
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                border: Border.all(color: AppTheme.gold.withOpacity(0.2)),
              ),
              child: Container(
                decoration: const BoxDecoration(color: Colors.white10, shape: BoxShape.circle),
                child: const Icon(Icons.videocam_outlined, color: AppTheme.gold, size: 60),
              ),
            ).animate().scale(duration: 400.ms, curve: Curves.easeOutBack),
            const SizedBox(height: 48),
            Text(_sessionData?['consultantName']?.toString().toUpperCase() ?? 'GLOBAL COUNSELLING', 
              textAlign: TextAlign.center,
              style: const TextStyle(color: AppTheme.textPrimary, fontSize: 26, fontWeight: FontWeight.w900, fontFamily: 'Playfair Display', height: 1.2)),
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
              decoration: BoxDecoration(color: AppTheme.cream, borderRadius: BorderRadius.circular(16)),
              child: Column(
                children: [
                   Text('${(_sessionData?['date'] == null || _sessionData?['date'] == "null") ? 'Scheduled' : _sessionData!['date']} | ${(_sessionData?['time'] == null || _sessionData?['time'] == "null") ? 'Live' : _sessionData!['time']}', 
                     style: const TextStyle(color: AppTheme.gold, fontSize: 14, fontWeight: FontWeight.w900, letterSpacing: 0.5)),
                   if (_sessionData?['meetingId'] != null) ...[
                     const SizedBox(height: 6),
                     Text('ROOM ID: ${_sessionData!['meetingId']}', style: const TextStyle(color: AppTheme.textMuted, fontSize: 14, fontWeight: FontWeight.w900, letterSpacing: 1)),
                   ]
                ],
              ),
            ),
            const SizedBox(height: 20),
            Text('JOINING AS: ${auth.user?['name']?.toString().toUpperCase() ?? 'GUEST'}', 
              style: const TextStyle(color: AppTheme.textSecondary, fontSize: 14, fontWeight: FontWeight.w900, letterSpacing: 1.2)),
            const SizedBox(height: 80),
            SizedBox(
              width: double.infinity,
              height: 64,
              child: ElevatedButton(
                onPressed: _joinMeeting,
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.gold,
                  foregroundColor: Colors.black,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                  elevation: 10,
                  shadowColor: AppTheme.gold.withOpacity(0.4),
                ),
                child: Text(
                    (auth.role == 'admin' || auth.role == 'consultant' || _sessionData?['isHost'] == true)
                        ? 'START MEETING'
                        : 'JOIN MEETING',
                    style: const TextStyle(fontWeight: FontWeight.w900, letterSpacing: 1.5, fontSize: 13),
                  ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildVideoLayout() {
    final activeParticipants = _joinedParticipants.toList();
    final isHost = context.read<AuthProvider>().role == 'admin' || context.read<AuthProvider>().role == 'consultant';
    
    if (activeParticipants.isEmpty) {
      return Stack(
        fit: StackFit.expand,
        children: [
          if (_isVideoOff)
            Container(
              color: Colors.black,
              child: Center(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Container(
                      width: 80, height: 80,
                      decoration: BoxDecoration(border: Border.all(color: AppTheme.gold, width: 2), shape: BoxShape.circle),
                      child: Center(child: Text(context.read<AuthProvider>().user?['name']?[0]?.toUpperCase() ?? 'U', style: const TextStyle(color: AppTheme.gold, fontSize: 32, fontWeight: FontWeight.w900))),
                    ),
                    const SizedBox(height: 20),
                    const Text('VIDEO SUSPENDED', style: TextStyle(color: Colors.white38, fontSize: 14, fontWeight: FontWeight.w800, letterSpacing: 2)),
                  ],
                ),
              ),
            )
          else
            RTCVideoView(_localRenderer, mirror: true, objectFit: RTCVideoViewObjectFit.RTCVideoViewObjectFitCover),
          
          if (!isHost && !_advisorJoined && !_remoteWebRTCConnected)
            Center(
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                decoration: BoxDecoration(color: Colors.black45, borderRadius: BorderRadius.circular(20)),
                child: const Text('Waiting for advisor to join...', 
                  style: TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.w600)),
              ),
            ),
          _participantLabel("You (Self)"),
          if (_isAudioMuted) _muteIcon(),
        ],
      );
    }
    
    return Column(
      children: [
        // Top Rectangle(s): Remote Participant(s)
        ...activeParticipants.map((pid) {
          final renderer = _remoteRenderers[pid];
          final name = _participantNames[pid] ?? "Participant";
          final videoOff = _remoteVideoOff[pid] == true;
          final audioMuted = _remoteAudioMuted[pid] == true;

          return Expanded(
            key: ValueKey(pid),
            child: Container(
              margin: const EdgeInsets.only(bottom: 8),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: AppTheme.gold.withOpacity(0.5), width: 2),
                color: Colors.black,
              ),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(18),
                child: Stack(
                  fit: StackFit.expand,
                  children: [
                    if (videoOff)
                      _videoPlaceholder(name)
                    else if (renderer != null && renderer.srcObject != null)
                      RTCVideoView(renderer, objectFit: RTCVideoViewObjectFit.RTCVideoViewObjectFitCover)
                    else
                      _videoPlaceholder(name),
                    
                    _participantLabel(name),
                    if (audioMuted) _participantMutedIcon(),
                  ],
                ),
              ),
            ),
          );
        }),
        
        // Bottom Rectangle: Local Me
        Expanded(
          key: const ValueKey('local_me'),
          child: Container(
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: Colors.white24, width: 1),
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(18),
              child: Stack(
                fit: StackFit.expand,
                children: [
                  if (_isVideoOff)
                    _videoPlaceholder("You")
                  else
                    RTCVideoView(_localRenderer, mirror: true, objectFit: RTCVideoViewObjectFit.RTCVideoViewObjectFitCover),
                  
                  _participantLabel("You (Self)"),
                  if (_isAudioMuted) _muteIcon(),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _videoPlaceholder(String name) {
    return Container(
      color: Colors.grey.shade900,
      child: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 60, height: 60,
              decoration: BoxDecoration(shape: BoxShape.circle, border: Border.all(color: AppTheme.gold.withOpacity(0.2), width: 2)),
              child: Center(child: Text(name[0].toUpperCase(), style: const TextStyle(color: AppTheme.gold, fontSize: 24, fontWeight: FontWeight.w900))),
            ),
            const SizedBox(height: 12),
            const Text('VIDEO OFF', style: TextStyle(color: Colors.white24, fontSize: 13, fontWeight: FontWeight.w900, letterSpacing: 1.5)),
          ],
        ),
      ),
    );
  }

  Widget _participantMutedIcon() {
    return Positioned(
      top: 12, right: 12,
      child: Container(
        padding: const EdgeInsets.all(4),
        decoration: BoxDecoration(color: Colors.black54, borderRadius: BorderRadius.circular(8)),
        child: const Icon(Icons.mic_off, color: Colors.redAccent, size: 14),
      ),
    );
  }

  Widget _muteIcon() {
    return Positioned(
      top: 16, right: 16,
      child: Container(
        padding: const EdgeInsets.all(6),
        decoration: const BoxDecoration(color: Colors.redAccent, shape: BoxShape.circle),
        child: const Icon(Icons.mic_off, color: Colors.white, size: 16),
      ),
    );
  }

  Widget _participantLabel(String name) {
    return Positioned(
      bottom: 24, left: 24,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(color: Colors.black.withOpacity(0.5), borderRadius: BorderRadius.circular(20), border: Border.all(color: Colors.white10)),
        child: Text(name, style: const TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.bold)),
      ),
    );
  }

  Widget _buildTopBar() {
    return Positioned(
      top: 0, left: 0, right: 0,
      child: Container(
        padding: const EdgeInsets.fromLTRB(28, 64, 28, 40),
        decoration: BoxDecoration(
          gradient: LinearGradient(begin: Alignment.topCenter, end: Alignment.bottomCenter, colors: [Colors.white.withOpacity(0.95), Colors.white.withOpacity(0.0)]),
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(width: 8, height: 8, decoration: const BoxDecoration(color: Colors.green, shape: BoxShape.circle)),
                    const SizedBox(width: 8),
                    Text(_sessionData?['consultantName'] ?? 'Counselling Room', 
                      style: const TextStyle(color: AppTheme.textPrimary, fontWeight: FontWeight.w900, fontSize: 16, letterSpacing: 0.5)),
                  ],
                ),
                const SizedBox(height: 4),
                Text('${(_sessionData?['date'] == null || _sessionData?['date'] == "null") ? 'Session' : _sessionData!['date']} · ${(_sessionData?['time'] == null || _sessionData?['time'] == "null") ? 'Live' : _sessionData!['time']}', 
                  style: const TextStyle(color: AppTheme.textSecondary, fontWeight: FontWeight.w600, fontSize: 14)),
              ],
            ),
            Text(_sessionData?['meetingId']?.toString().toUpperCase() ?? 'LIVE ROOM', 
              style: const TextStyle(color: AppTheme.textMuted, fontSize: 14, fontWeight: FontWeight.bold)),
          ],
        ),
      ),
    );
  }

  Widget _buildBottomStatus() {
    return Positioned(
      bottom: 130, left: 28, right: 28,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: const [
              Text('Session Room', style: TextStyle(color: AppTheme.textSecondary, fontSize: 14, fontWeight: FontWeight.w900)),
              SizedBox(height: 2),
              Text('LIVE ENCRYPTION ACTIVE', style: TextStyle(color: AppTheme.textMuted, fontSize: 13, fontWeight: FontWeight.w800, letterSpacing: 1)),
            ],
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              const Text('SIGNAL STRENGTH', style: TextStyle(color: AppTheme.textMuted, fontSize: 14, fontWeight: FontWeight.w900, letterSpacing: 1)),
              const SizedBox(height: 4),
              Row(
                children: [
                  for (int i = 0; i < 4; i++)
                    Container(
                      margin: const EdgeInsets.only(left: 2),
                      width: 3, height: 4.0 + (i * 3),
                      decoration: BoxDecoration(color: i < 3 ? AppTheme.gold : AppTheme.borderLight, borderRadius: BorderRadius.circular(1)),
                    ),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildMeetingControls() {
    return Positioned(
      bottom: 0, left: 0, right: 0,
      child: Container(
        padding: const EdgeInsets.fromLTRB(20, 20, 20, 48),
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(30)),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
            _circularControl(
              icon: _isAudioMuted ? Icons.mic_off : Icons.mic,
              active: !_isAudioMuted,
              onTap: () {
                setState(() => _isAudioMuted = !_isAudioMuted);
                _localStream?.getAudioTracks().forEach((t) => t.enabled = !_isAudioMuted);
                _socket?.emit('update-participant-state', {
                  'meetingId': _sessionData?['meetingId'],
                  'participantId': _myParticipantId,
                  'isAudioMuted': _isAudioMuted,
                });
              },
            ),
            _circularControl(
              icon: _isVideoOff ? Icons.videocam_off : Icons.videocam,
              active: !_isVideoOff,
              onTap: () {
                setState(() => _isVideoOff = !_isVideoOff);
                _localStream?.getVideoTracks().forEach((t) => t.enabled = !_isVideoOff);
                _socket?.emit('update-participant-state', {
                  'meetingId': _sessionData?['meetingId'],
                  'participantId': _myParticipantId,
                  'isVideoOff': _isVideoOff,
                });
              },
            ),
            _circularControl(
              icon: Icons.chat_bubble_outline,
              active: _showChat,
              onTap: () => setState(() => _showChat = !_showChat),
            ),
            _circularControl(
              icon: Icons.flip_camera_ios,
              active: true,
              onTap: () async {
                 if (_localStream != null) {
                    final videoTrack = _localStream!.getVideoTracks().first;
                    await Helper.switchCamera(videoTrack);
                 }
              },
            ),
            GestureDetector(
              onTap: () async {
                final confirm = await showDialog<bool>(
                  context: context,
                  builder: (ctx) => AlertDialog(
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                    title: const Text('End Meeting?', style: TextStyle(fontWeight: FontWeight.w900)),
                    content: const Text('Are you sure you want to leave the session?'),
                    actions: [
                      TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('CANCEL')),
                      ElevatedButton(
                        style: ElevatedButton.styleFrom(backgroundColor: Colors.red, foregroundColor: Colors.white, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12))),
                        onPressed: () => Navigator.pop(ctx, true),
                        child: const Text('END'),
                      ),
                    ],
                  ),
                );
                if (confirm == true) _handleHangup();
              },
              child: Container(
                width: 56, height: 56,
                decoration: const BoxDecoration(color: Color(0xFFFF4B4B), shape: BoxShape.circle),
                child: const Icon(Icons.call_end, color: Colors.white, size: 28),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _circularControl({required IconData icon, required bool active, required VoidCallback onTap}) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 50, height: 50,
        decoration: BoxDecoration(
          color: active ? AppTheme.cream : Colors.red.withOpacity(0.1),
          shape: BoxShape.circle,
        ),
        child: Icon(icon, color: active ? AppTheme.textPrimary : Colors.red, size: 24),
      ),
    );
  }

  Widget _buildChatOverlay() {
    final myName = context.read<AuthProvider>().user?['name'] ?? 'Me';
    return Positioned(
      bottom: 120, right: 20, left: 20, height: 420,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(24),
          boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.15), blurRadius: 30, spreadRadius: 5)],
        ),
        child: Column(
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text('ROOM CHAT', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 13, letterSpacing: 1, color: AppTheme.textPrimary)),
                IconButton(icon: const Icon(Icons.close_rounded), onPressed: () => setState(() => _showChat = false)),
              ],
            ),
            const Divider(height: 24),
            Expanded(
              child: ListView.builder(
                padding: const EdgeInsets.only(bottom: 16),
                itemCount: _messages.length,
                itemBuilder: (context, index) {
                  final m = _messages[index];
                  final bool isMe = m['id'] == _myParticipantId || m['sender'] == 'You';
                  return Padding(
                    padding: const EdgeInsets.symmetric(vertical: 4),
                    child: Column(
                      crossAxisAlignment: isMe ? CrossAxisAlignment.end : CrossAxisAlignment.start,
                      children: [
                        if (!isMe) Text(m['sender'] ?? 'User', style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: AppTheme.textMuted)),
                        const SizedBox(height: 2),
                        Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: isMe ? AppTheme.gold.withOpacity(0.1) : Colors.white,
                            borderRadius: BorderRadius.circular(12),
                            border: isMe ? null : Border.all(color: AppTheme.borderLight),
                          ),
                          child: Text(m['text'], style: const TextStyle(color: AppTheme.textPrimary, fontSize: 13, height: 1.4)),
                        ),
                      ],
                    ),
                  );
                },
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(20),
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _chatController,
                      style: const TextStyle(color: AppTheme.textPrimary, fontSize: 14),
                      decoration: InputDecoration(
                        hintText: 'Message Admin...',
                        hintStyle: const TextStyle(color: AppTheme.textMuted),
                        filled: true,
                        fillColor: Colors.white,
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: AppTheme.borderLight)),
                        enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: AppTheme.borderLight)),
                        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                      ),
                      onSubmitted: (_) => _sendMessage(),
                    ),
                  ),
                  const SizedBox(width: 12),
                  IconButton(icon: const Icon(Icons.send_rounded, color: AppTheme.gold), onPressed: _sendMessage),
                ],
              ),
            ),
          ],
        ),
      ),
    ).animate().fadeIn().slideY(begin: 0.1);
  }
}
