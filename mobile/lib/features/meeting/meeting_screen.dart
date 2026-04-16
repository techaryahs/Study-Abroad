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
    final cam = await Permission.camera.request();
    final mic = await Permission.microphone.request();

    if (cam.isGranted && mic.isGranted) {
      try {
        final Map<String, dynamic> constraints = {
          'audio': true,
          'video': <String, dynamic>{
            'facingMode': 'user',
            'width': 1280,
            'height': 720,
          },
        };
        _localStream = await navigator.mediaDevices.getUserMedia(constraints);
        _localRenderer.srcObject = _localStream;
        setState(() {
          _setupDone = true;
          _isCalling = true; // Mark as calling so offers are sent
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
    final auth = context.read<AuthProvider>();
    final user = auth.user;
    if (user == null) return;

    _socket = io.io(ApiClient.baseUrl, <String, dynamic>{
      'transports': ['websocket'],
      'autoConnect': false,
    });

    _socket!.connect();

    _socket!.onConnect((_) {
      setState(() => _isConnected = true);
      _socket!.emit('join-meeting', {
        'meetingId': _sessionData?['meetingId'],
        'participantId': _myParticipantId,
        'participantName': user['name'] ?? 'Guest',
        'isHost': auth.role == 'admin',
        'sessionId': widget.sessionId,
      });
    });

    _socket!.onDisconnect((_) => setState(() => _isConnected = false));

    _socket!.on('existing-participants', (data) {
       final participants = data as List;
       for (var p in participants) {
         _createPeerConnection(p['participantId'], p['participantName']);
         if (_isCalling) _sendOffer(p['participantId']);
       }
    });

    _socket!.on('participant-joined', (data) {
       _createPeerConnection(data['participantId'], data['participantName']);
       if (_isCalling) _sendOffer(data['participantId']);
    });

    _socket!.on('offer', (data) async {
       final fromId = data['fromParticipantId'];
       final offer = data['offer'];
       var pc = _peerConnections[fromId] ?? await _createPeerConnection(fromId, "Remote");
       await pc.setRemoteDescription(RTCSessionDescription(offer['sdp'], offer['type']));
       final answer = await pc.createAnswer();
       await pc.setLocalDescription(answer);
       _socket!.emit('answer', {
         'meetingId': _sessionData?['meetingId'],
         'toParticipantId': fromId,
         'answer': {'sdp': answer.sdp, 'type': answer.type},
       });
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

    _socket!.on('chat-message', (msg) {
      if (mounted && msg is Map) {
        setState(() => _messages.add(Map<String, dynamic>.from(msg)));
      }
    });

    _socket!.on('call-started', (_) => setState(() => _isCalling = true));
    _socket!.on('call-ended', (_) => _handleHangup());
  }

  Future<RTCPeerConnection> _createPeerConnection(String remoteId, String name) async {
    final Map<String, dynamic> config = {
      'iceServers': [
        <String, dynamic>{'urls': 'stun:stun.l.google.com:19302'}
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
    return pc;
  }

  void _addRemoteRenderer(String id, MediaStream stream) async {
    final renderer = RTCVideoRenderer();
    await renderer.initialize();
    renderer.srcObject = stream;
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
      'sender': 'You',
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
    _socket?.disconnect();
    _peerConnections.forEach((k, pc) => pc.close());
    _remoteRenderers.forEach((k, r) => r.dispose());
    _localStream?.getTracks().forEach((t) => t.stop());
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
          _buildMeetingControls(),
        ],
      ),
    );
  }

  Widget _buildPreJoin() {
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
                     style: const TextStyle(color: AppTheme.gold, fontSize: 12, fontWeight: FontWeight.w900, letterSpacing: 0.5)),
                   if (_sessionData?['meetingId'] != null) ...[
                     const SizedBox(height: 6),
                     Text('ROOM ID: ${_sessionData!['meetingId']}', style: const TextStyle(color: AppTheme.textMuted, fontSize: 9, fontWeight: FontWeight.w900, letterSpacing: 1)),
                   ]
                ],
              ),
            ),
            const SizedBox(height: 20),
            Text('JOINING AS: ${context.read<AuthProvider>().user?['name']?.toString().toUpperCase() ?? 'GUEST'}', 
              style: const TextStyle(color: AppTheme.textSecondary, fontSize: 10, fontWeight: FontWeight.w900, letterSpacing: 1.2)),
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
                child: const Text('JOIN ROOM VIDEO', style: TextStyle(fontWeight: FontWeight.w900, letterSpacing: 1.5, fontSize: 13)),
              ),
            ).animate().slideY(begin: 0.2, duration: 500.ms),
          ],
        ),
      ),
    );
  }

  Widget _buildVideoLayout() {
    final remotes = _remoteRenderers.values.toList();
    if (remotes.isEmpty) {
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
                    const Text('VIDEO SUSPENDED', style: TextStyle(color: Colors.white38, fontSize: 10, fontWeight: FontWeight.w800, letterSpacing: 2)),
                  ],
                ),
              ),
            )
          else
            RTCVideoView(_localRenderer, mirror: true, objectFit: RTCVideoViewObjectFit.RTCVideoViewObjectFitCover),
          
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
    
    return PageView.builder(
      itemCount: remotes.length + 1,
      itemBuilder: (context, index) {
        if (index == 0) {
          return Stack(
            fit: StackFit.expand,
            children: [
              RTCVideoView(_localRenderer, mirror: true, objectFit: RTCVideoViewObjectFit.RTCVideoViewObjectFitCover),
              _participantLabel("You (Self)"),
              if (_isAudioMuted) _muteIcon(),
            ],
          );
        }
        final renderer = remotes[index - 1];
        return Stack(
          fit: StackFit.expand,
          children: [
            RTCVideoView(renderer, objectFit: RTCVideoViewObjectFit.RTCVideoViewObjectFitCover),
            _participantLabel("Participant ${index}"),
          ],
        );
      },
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
        child: Text(name, style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
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
                  style: const TextStyle(color: AppTheme.textSecondary, fontWeight: FontWeight.w600, fontSize: 10)),
              ],
            ),
            Text(_sessionData?['meetingId']?.toString().toUpperCase() ?? 'LIVE ROOM', 
              style: const TextStyle(color: AppTheme.textMuted, fontSize: 9, fontWeight: FontWeight.bold)),
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
              Text('Session Room', style: TextStyle(color: AppTheme.textSecondary, fontSize: 12, fontWeight: FontWeight.w900)),
              SizedBox(height: 2),
              Text('LIVE ENCRYPTION ACTIVE', style: TextStyle(color: AppTheme.textMuted, fontSize: 8, fontWeight: FontWeight.w800, letterSpacing: 1)),
            ],
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              const Text('SIGNAL STRENGTH', style: TextStyle(color: AppTheme.textMuted, fontSize: 7, fontWeight: FontWeight.w900, letterSpacing: 1)),
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
              },
            ),
            _circularControl(
              icon: _isVideoOff ? Icons.videocam_off : Icons.videocam,
              active: !_isVideoOff,
              onTap: () {
                setState(() => _isVideoOff = !_isVideoOff);
                _localStream?.getVideoTracks().forEach((t) => t.enabled = !_isVideoOff);
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
              onTap: _handleHangup,
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
    return Positioned(
      bottom: 120, right: 20, left: 20, height: 380,
      child: Container(
        decoration: BoxDecoration(
          color: AppTheme.backgroundAlt, 
          borderRadius: BorderRadius.circular(24), 
          border: Border.all(color: AppTheme.borderLight),
          boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.08), blurRadius: 40)],
        ),
        child: Column(
          children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 15),
              decoration: const BoxDecoration(border: Border(bottom: BorderSide(color: AppTheme.borderLight))),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text('TEAM CHAT', style: TextStyle(color: AppTheme.textPrimary, fontWeight: FontWeight.w900, fontSize: 11, letterSpacing: 1.5)),
                  IconButton(icon: const Icon(Icons.close, color: AppTheme.textSecondary, size: 18), onPressed: () => setState(() => _showChat = false)),
                ],
              ),
            ),
            Expanded(
              child: ListView.builder(
                padding: const EdgeInsets.all(20),
                itemCount: _messages.length,
                itemBuilder: (context, i) {
                  final m = _messages[i];
                  final isMe = m['sender'] == 'You';
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 16),
                    child: Column(
                      crossAxisAlignment: isMe ? CrossAxisAlignment.end : CrossAxisAlignment.start,
                      children: [
                        Text(m['sender'].toString().toUpperCase(), style: TextStyle(color: isMe ? AppTheme.gold : AppTheme.textSecondary, fontSize: 8, fontWeight: FontWeight.w900)),
                        const SizedBox(height: 4),
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
