import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme.dart';
import '../../core/api_client.dart';
import '../auth/auth_provider.dart';

class AdminDashboardScreen extends StatefulWidget {
  const AdminDashboardScreen({super.key});
  @override
  State<AdminDashboardScreen> createState() => _AdminDashboardScreenState();
}

class _AdminDashboardScreenState extends State<AdminDashboardScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  Map<String, dynamic> _stats = {};
  List<dynamic> _recentUsers = [];
  List<dynamic> _sessions = [];
  bool _loadingUsers = true;
  bool _loadingSessions = true;
  List<dynamic> _consultants = [];
  bool _loadingConsultants = true;
  String? _togglingConsultantId;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 5, vsync: this);
    _fetchUsersData();
    _fetchSessionsData();
    _fetchConsultants();
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  void _showChangePasswordDialog() {
    final oldPass = TextEditingController();
    final newPass = TextEditingController();

    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text("Change Password"),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: oldPass,
              obscureText: true,
              decoration: const InputDecoration(labelText: "Old Password"),
            ),
            TextField(
              controller: newPass,
              obscureText: true,
              decoration: const InputDecoration(labelText: "New Password"),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text("Cancel"),
          ),
          ElevatedButton(
            onPressed: () async {
              try {
                await ApiClient.instance.put(
                  '/api/auth/change-password',
                  data: {
                    "oldPassword": oldPass.text,
                    "newPassword": newPass.text,
                  },
                );

                Navigator.pop(context);

                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text("Password updated successfully")),
                );
              } catch (e) {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text(extractErrorMessage(e))),
                );
              }
            },
            child: const Text("Update"),
          ),
        ],
      ),
    );
  }

  void _showAddSlotDialog(String day) {
    final startController = TextEditingController();
    final endController = TextEditingController();

    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: Text("Add Slot - $day"),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: startController,
              decoration: const InputDecoration(labelText: "Start Time (HH:mm)"),
            ),
            TextField(
              controller: endController,
              decoration: const InputDecoration(labelText: "End Time (HH:mm)"),
            ),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text("Cancel")),
          ElevatedButton(
            onPressed: () async {
              await ApiClient.instance.post(
                '/api/weekly-schedule/day/$day/slot',
                data: {
                  "startTime": startController.text,
                  "endTime": endController.text,
                  "duration": 60,
                },
              );
              Navigator.pop(context);
              setState(() {});
            },
            child: const Text("Add"),
          ),
        ],
      ),
    );
  }

  Future<void> _toggleVideoAccess(String consultantId) async {
    setState(() => _togglingConsultantId = consultantId);

    try {
      final res = await ApiClient.instance.put(
        '/api/admin/consultants/$consultantId/toggle-video',
      );

      final updated = res.data;

      setState(() {
        _consultants = _consultants.map((c) {
          if (c['_id'] == consultantId) {
            return {
              ...c,
              'videoCallEnabled': updated['videoCallEnabled']
            };
          }
          return c;
        }).toList();
        _togglingConsultantId = null;
      });

    } catch (e) {
      setState(() => _togglingConsultantId = null);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(extractErrorMessage(e))),
      );
    }
  }

  Future<void> _fetchConsultants() async {
    try {
      final res = await ApiClient.instance.get('/api/admin/consultants');
      final data = res.data;

      if (mounted) {
        setState(() {
          _consultants = data is List ? data : (data['consultants'] ?? []);
          _loadingConsultants = false;
        });
      }
    } catch (e) {
      if (mounted) setState(() => _loadingConsultants = false);
    }
  }

  Future<void> _fetchUsersData() async {
    try {
      final usersRes = await ApiClient.instance.get('/api/admin/users');
      final data = usersRes.data;
      final users = data is List ? data : (data['users'] ?? []);
      if (mounted) {
        setState(() {
          _recentUsers = (users as List).take(5).toList();
          _stats = {
            'totalUsers': users.length,
            'students': users.where((u) => u['role'] == 'student').length,
            'consultants': users.where((u) => u['role'] == 'consultant').length,
          };
          _loadingUsers = false;
        });
      }
    } catch (_) {
      if (mounted) setState(() => _loadingUsers = false);
    }
  }

  Future<void> _fetchSessionsData() async {
    try {
      final res = await ApiClient.instance.get('/api/bookings?bookingType=counselling');
      final data = res.data;
      if (mounted) {
        setState(() {
          _sessions = data is List ? data : (data['bookings'] ?? data['data'] ?? []);

          _sessions.sort((a, b) {
            final aDate = _parseSessionDate(a);
            final bDate = _parseSessionDate(b);
            return bDate.compareTo(aDate); // latest first
          });

          _loadingSessions = false;
        });
      }
    } catch (_) {
      if (mounted) setState(() => _loadingSessions = false);
    }
  }

  Future<void> _cancelSession(String sessionId) async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Cancel Session?'),
        content: const Text('Are you sure you want to cancel this counselling session?'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('NO')),
          TextButton(onPressed: () => Navigator.pop(ctx, true), child: const Text('YES', style: TextStyle(color: Colors.red))),
        ],
      ),
    );
    if (confirm != true) return;

    try {
      await ApiClient.instance.put('/api/bookings/cancel/$sessionId');
      setState(() {
        for (var session in _sessions) {
          if (session['_id'] == sessionId) {
            session['status'] = 'cancelled';
          }
        }
      });
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Session cancelled')));
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(extractErrorMessage(e))));
      }
    }
  }

  Future<void> _joinMeeting(String sessionId, dynamic session) async {
    context.push('/meeting/$sessionId', extra: Map<String, dynamic>.from(session));
  }

  bool _isSessionPast(dynamic session) {
    try {
      if (session['date'] == null) return false;

      DateTime sessionDate;

      /// ✅ Handle multiple formats safely
      if (session['date'].toString().contains('-')) {
        // yyyy-MM-dd or ISO
        sessionDate = DateTime.parse(session['date']);
      } else {
        // dd/MM/yyyy
        final parts = session['date'].split('/');
        sessionDate = DateTime(
          int.parse(parts[2]),
          int.parse(parts[1]),
          int.parse(parts[0]),
        );
      }

      /// ✅ Handle time
      if (session['endTime'] != null && session['endTime'].toString().isNotEmpty) {
        final time = session['endTime'].toString().toLowerCase();

        final match = RegExp(r'(\d+):(\d+)').firstMatch(time);
        if (match != null) {
          int hour = int.parse(match.group(1)!);
          int minute = int.parse(match.group(2)!);

          if (time.contains('pm') && hour != 12) hour += 12;
          if (time.contains('am') && hour == 12) hour = 0;

          sessionDate = DateTime(
            sessionDate.year,
            sessionDate.month,
            sessionDate.day,
            hour,
            minute,
          );
        }
      }

      return sessionDate.isBefore(DateTime.now());
    } catch (e) {
      return false;
    }
  }

  DateTime _parseSessionDate(dynamic session) {
    try {
      if (session['date'] == null) return DateTime.now();

      if (session['date'].toString().contains('-')) {
        return DateTime.parse(session['date']);
      } else {
        final parts = session['date'].split('/');
        return DateTime(
          int.parse(parts[2]),
          int.parse(parts[1]),
          int.parse(parts[0]),
        );
      }
    } catch (_) {
      return DateTime.now();
    }
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    
    final activeSessions = _sessions.where((s) {
      final status = s['status']?.toString().toLowerCase();

      return (status == 'booked' ||
              status == 'confirmed' ||
              status == 'active' || 
              status == 'pending') &&
          !_isSessionPast(s);
    }).toList();
    
    final pastSessions = _sessions.where((s) {
      final status = s['status']?.toString().toLowerCase();

      return status == 'completed' ||
             status == 'cancelled' ||
             _isSessionPast(s);
    }).toList();

    return Scaffold(
      backgroundColor: AppTheme.background,
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            pinned: true,
            backgroundColor: AppTheme.darkBrown,
            expandedHeight: 180,
            actions: [
              IconButton(
                icon: const Icon(Icons.logout_rounded, color: Colors.white54),
                onPressed: () async => await auth.logout(),
              ),
            ],
            flexibleSpace: FlexibleSpaceBar(
              background: Container(
                color: AppTheme.darkBrown,
                padding: const EdgeInsets.fromLTRB(20, 70, 20, 20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Admin Dashboard',
                        style: TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.w900)),
                    Text(auth.user?['name'] ?? 'Admin',
                        style: TextStyle(color: Colors.white.withOpacity(0.5), fontSize: 13)),
                  ],
                ),
              ),
            ),
            bottom: TabBar(
              controller: _tabController,
              isScrollable: true,
              tabAlignment: TabAlignment.start,
              indicatorColor: AppTheme.gold,
              labelColor: AppTheme.gold,
              unselectedLabelColor: Colors.white54,
              tabs: [
                Tab(text: 'Active (${activeSessions.length})'),
                Tab(text: 'Past (${pastSessions.length})'),
                const Tab(text: 'Consultants'),
                const Tab(text: 'Slots'),
                const Tab(text: 'Profile'),
              ],
            ),
          ),

          SliverFillRemaining(
            child: TabBarView(
              controller: _tabController,
              children: [
                _buildActiveSessions(activeSessions),
                _buildPastSessions(pastSessions),
                _buildConsultantManagement(),
                _buildSlotsManagement(),
                _buildAdminProfile(),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _profileTile({
    required IconData icon,
    required String title,
    required VoidCallback onTap,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppTheme.borderLight),
      ),
      child: ListTile(
        leading: Icon(icon, color: AppTheme.gold),
        title: Text(
          title,
          style: const TextStyle(fontWeight: FontWeight.w600),
        ),
        trailing: const Icon(Icons.arrow_forward_ios, size: 14),
        onTap: onTap,
      ),
    );
  }

  Widget _buildAdminProfile() {
    final auth = context.watch<AuthProvider>();
    final user = auth.user ?? {};

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        /// PROFILE CARD
        Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(18),
            border: Border.all(color: AppTheme.borderLight),
          ),
          child: Column(
            children: [
              /// AVATAR
              Container(
                width: 80,
                height: 80,
                decoration: BoxDecoration(
                  color: AppTheme.gold.withOpacity(0.1),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.person, size: 40, color: AppTheme.gold),
              ),

              const SizedBox(height: 12),

              Text(
                user['name'] ?? 'Admin',
                style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w900,
                ),
              ),

              Text(
                user['email'] ?? '',
                style: const TextStyle(
                  fontSize: 12,
                  color: AppTheme.textSecondary,
                ),
              ),

              const SizedBox(height: 10),

              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: AppTheme.gold.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: const Text(
                  "ADMIN",
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.w800,
                    color: AppTheme.gold,
                  ),
                ),
              ),
            ],
          ),
        ),

        const SizedBox(height: 20),

        /// ACTIONS
        _profileTile(
          icon: Icons.lock,
          title: "Change Password",
          onTap: _showChangePasswordDialog,
        ),

        _profileTile(
          icon: Icons.security,
          title: "Security Settings",
          onTap: () {},
        ),

        _profileTile(
          icon: Icons.info_outline,
          title: "About Admin",
          onTap: () {},
        ),

        const SizedBox(height: 20),

        /// LOGOUT BUTTON
        ElevatedButton.icon(
          onPressed: () async {
            await auth.logout();
          },
          icon: const Icon(Icons.logout),
          label: const Text("LOGOUT"),
          style: ElevatedButton.styleFrom(
            backgroundColor: Colors.red,
            foregroundColor: Colors.white,
            padding: const EdgeInsets.symmetric(vertical: 14),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildActiveSessions(List<dynamic> activeSessions) {
    if (_loadingSessions) {
      return const Center(child: CircularProgressIndicator(color: AppTheme.gold));
    }
    if (activeSessions.isEmpty) {
      return const Center(child: Text('No active sessions found.', style: TextStyle(color: AppTheme.textSecondary)));
    }
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: activeSessions.length,
      itemBuilder: (context, index) {
        final b = activeSessions[index];
        final name = b['userName'] ?? b['studentName'] ?? b['userEmail'] ?? 'Student';
        return Container(
          margin: const EdgeInsets.only(bottom: 12),
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(18),
            border: Border.all(color: AppTheme.borderLight),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                   Container(
                      width: 44, height: 44,
                      decoration: BoxDecoration(color: AppTheme.gold.withOpacity(0.1), shape: BoxShape.circle),
                      child: const Icon(Icons.person_rounded, color: AppTheme.gold, size: 22),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(name, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: AppTheme.textPrimary)),
                          Text(b['userEmail'] ?? '', style: const TextStyle(fontSize: 11, color: AppTheme.textSecondary)),
                        ],
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                      decoration: BoxDecoration(
                        color: AppTheme.gold.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: const Text('ACTIVE', style: TextStyle(fontSize: 10, fontWeight: FontWeight.w800, color: AppTheme.gold)),
                    ),
                ],
              ),
              const Padding(
                padding: EdgeInsets.symmetric(vertical: 12),
                child: Divider(color: AppTheme.borderLight),
              ),
              Row(
                children: [
                  const Icon(Icons.calendar_today_rounded, size: 14, color: AppTheme.textSecondary),
                  const SizedBox(width: 6),
                  Text(b['date'] ?? '—', style: const TextStyle(fontSize: 12, color: AppTheme.textPrimary, fontWeight: FontWeight.w600)),
                  const SizedBox(width: 16),
                  const Icon(Icons.access_time_rounded, size: 14, color: AppTheme.textSecondary),
                  const SizedBox(width: 6),
                  Text('${b['time'] ?? '—'} - ${b['endTime'] ?? '—'}', style: const TextStyle(fontSize: 12, color: AppTheme.textPrimary, fontWeight: FontWeight.w600)),
                ],
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(
                    child: ElevatedButton.icon(
                      onPressed: () => _joinMeeting(b['sessionId'] ?? b['_id'], b),
                      icon: const Icon(Icons.video_camera_front_rounded, size: 18),
                      label: const Text('JOIN MEETING'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.gold,
                        foregroundColor: AppTheme.darkBrown,
                        elevation: 0,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        textStyle: const TextStyle(fontSize: 11, fontWeight: FontWeight.w800, letterSpacing: 1),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  IconButton(
                    onPressed: () => _cancelSession(b['_id']),
                    icon: const Icon(Icons.cancel_outlined, color: Colors.red),
                    tooltip: 'Cancel Session',
                    style: IconButton.styleFrom(
                      backgroundColor: Colors.red.withOpacity(0.1),
                      padding: const EdgeInsets.all(12),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ).animate().fadeIn(delay: Duration(milliseconds: index * 50));
      },
    );
  }

  Widget _buildPastSessions(List<dynamic> pastSessions) {
    if (_loadingSessions) {
      return const Center(child: CircularProgressIndicator(color: AppTheme.gold));
    }
    if (pastSessions.isEmpty) {
      return const Center(child: Text('No past sessions found.', style: TextStyle(color: AppTheme.textSecondary)));
    }
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: pastSessions.length,
      itemBuilder: (context, index) {
        final b = pastSessions[index];
        final name = b['userName'] ?? b['studentName'] ?? b['userEmail'] ?? 'Student';
        final isCancelled = b['status']?.toString().toLowerCase() == 'cancelled';

        return Container(
          margin: const EdgeInsets.only(bottom: 12),
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white.withOpacity(0.5),
            borderRadius: BorderRadius.circular(18),
            border: Border.all(color: AppTheme.borderLight),
          ),
          child: Row(
            children: [
               Container(
                  width: 44, height: 44,
                  decoration: BoxDecoration(color: Colors.grey.withOpacity(0.1), shape: BoxShape.circle),
                  child: const Icon(Icons.person_rounded, color: Colors.grey, size: 22),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(name, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: AppTheme.textSecondary)),
                      const SizedBox(height: 4),
                      Row(
                        children: [
                          const Icon(Icons.calendar_today_rounded, size: 12, color: AppTheme.textSecondary),
                          const SizedBox(width: 4),
                          Text('${b['date']} · ${b['time']}', style: const TextStyle(fontSize: 10, color: AppTheme.textSecondary)),
                        ],
                      ),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                  decoration: BoxDecoration(
                    color: isCancelled ? Colors.red.withOpacity(0.1) : Colors.green.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(isCancelled ? 'CANCELLED' : 'COMPLETED', 
                      style: TextStyle(fontSize: 9, fontWeight: FontWeight.w800, color: isCancelled ? Colors.red : Colors.green)),
                ),
            ],
          ),
        ).animate().fadeIn(delay: Duration(milliseconds: index * 50));
      },
    );
  }

  Widget _buildConsultantManagement() {
    if (_loadingConsultants) {
      return const Center(
        child: CircularProgressIndicator(color: AppTheme.gold),
      );
    }

    if (_consultants.isEmpty) {
      return const Center(
        child: Text(
          'No counsellors found',
          style: TextStyle(color: AppTheme.textSecondary),
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: _consultants.length,
      itemBuilder: (context, index) {
        final c = _consultants[index];

        final isEnabled = c['videoCallEnabled'] == true;
        final isPremium = c['isPremium'] == true;

        return Container(
          margin: const EdgeInsets.only(bottom: 12),
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(18),
            border: Border.all(color: AppTheme.borderLight),
          ),
          child: Row(
            children: [
              // Avatar
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: AppTheme.gold.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Icon(Icons.person, color: AppTheme.gold),
              ),

              const SizedBox(width: 14),

              // Info
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      c['name'] ?? 'Consultant',
                      style: const TextStyle(
                        fontWeight: FontWeight.w800,
                        fontSize: 14,
                      ),
                    ),
                    Text(
                      c['email'] ?? '',
                      style: const TextStyle(
                        fontSize: 11,
                        color: AppTheme.textSecondary,
                      ),
                    ),
                    const SizedBox(height: 4),

                    Row(
                      children: [
                        Text(
                          (c['expertise'] ?? 'General')
                              .toString()
                              .toUpperCase(),
                          style: const TextStyle(
                            fontSize: 9,
                            fontWeight: FontWeight.w800,
                            color: AppTheme.textSecondary,
                          ),
                        ),

                        if (isPremium) ...[
                          const SizedBox(width: 6),
                          Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 6, vertical: 2),
                            decoration: BoxDecoration(
                              color: AppTheme.gold.withOpacity(0.1),
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: const Text(
                              'PREMIUM',
                              style: TextStyle(
                                fontSize: 8,
                                fontWeight: FontWeight.w900,
                                color: AppTheme.gold,
                              ),
                            ),
                          )
                        ]
                      ],
                    )
                  ],
                ),
              ),

              // Toggle Button
              ElevatedButton.icon(
                onPressed: _togglingConsultantId == c['_id']
                    ? null
                    : () => _toggleVideoAccess(c['_id']),
                icon: _togglingConsultantId == c['_id']
                    ? const SizedBox(
                        width: 14,
                        height: 14,
                        child: CircularProgressIndicator(strokeWidth: 2),
                      )
                    : Icon(
                        isEnabled
                            ? Icons.videocam_rounded
                            : Icons.videocam_off_rounded,
                        size: 16,
                      ),
                label: Text(
                  isEnabled ? 'ENABLED' : 'DISABLED',
                  style: const TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.w800,
                  ),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: isEnabled
                      ? AppTheme.gold
                      : Colors.grey.shade200,
                  foregroundColor:
                      isEnabled ? AppTheme.darkBrown : Colors.grey,
                  elevation: 0,
                  padding:
                      const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
              ),
            ],
          ),
        ).animate().fadeIn(delay: Duration(milliseconds: index * 50));
      },
    );
  }

  Widget _buildSlotsManagement() {
    return FutureBuilder(
      future: ApiClient.instance.get('/api/weekly-schedule'),
      builder: (context, snapshot) {
        if (!snapshot.hasData) {
          return const Center(
            child: CircularProgressIndicator(color: AppTheme.gold),
          );
        }

        final data = snapshot.data as dynamic;
        final schedule = data.data['schedule']?['schedule'] ?? [];

        return ListView.builder(
          padding: const EdgeInsets.all(16),
          itemCount: schedule.length,
          itemBuilder: (context, index) {
            final day = schedule[index];
            final slots = day['timeSlots'] ?? [];
            final isEnabled = day['isEnabled'] ?? false;

            return Container(
              margin: const EdgeInsets.only(bottom: 14),
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppTheme.borderLight),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  /// HEADER
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        day['dayOfWeek'].toString().toUpperCase(),
                        style: const TextStyle(
                          fontWeight: FontWeight.w800,
                          fontSize: 14,
                        ),
                      ),

                      Switch(
                        value: isEnabled,
                        activeColor: AppTheme.gold,
                        onChanged: (_) async {
                          await ApiClient.instance.patch(
                            '/api/weekly-schedule/day/${day['dayOfWeek']}/toggle',
                          );
                          setState(() {});
                        },
                      ),
                    ],
                  ),

                  const SizedBox(height: 10),

                  /// SLOTS
                  if (slots.isEmpty)
                    const Text(
                      "No slots available",
                      style: TextStyle(color: AppTheme.textSecondary),
                    )
                  else
                    ...slots.map<Widget>((slot) {
                      return Container(
                        margin: const EdgeInsets.only(bottom: 8),
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: slot['isActive']
                              ? Colors.green.withOpacity(0.05)
                              : Colors.grey.withOpacity(0.05),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              "${slot['startTime']} - ${slot['endTime']}",
                              style: const TextStyle(
                                fontWeight: FontWeight.w600,
                              ),
                            ),

                            Row(
                              children: [
                                /// ENABLE / DISABLE
                                IconButton(
                                  icon: Icon(
                                    slot['isActive']
                                        ? Icons.toggle_on
                                        : Icons.toggle_off,
                                    color: slot['isActive']
                                        ? Colors.green
                                        : Colors.grey,
                                  ),
                                  onPressed: () async {
                                    await ApiClient.instance.patch(
                                      '/api/weekly-schedule/day/${day['dayOfWeek']}/slot/${slot['_id']}/toggle',
                                    );
                                    setState(() {});
                                  },
                                ),

                                /// DELETE
                                IconButton(
                                  icon: const Icon(Icons.delete, color: Colors.red),
                                  onPressed: () async {
                                    await ApiClient.instance.delete(
                                      '/api/weekly-schedule/day/${day['dayOfWeek']}/slot/${slot['_id']}',
                                    );
                                    setState(() {});
                                  },
                                ),
                              ],
                            ),
                          ],
                        ),
                      );
                    }).toList(),

                  const SizedBox(height: 10),

                  /// ADD SLOT BUTTON
                  ElevatedButton(
                    onPressed: () {
                      _showAddSlotDialog(day['dayOfWeek']);
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppTheme.gold,
                      foregroundColor: AppTheme.darkBrown,
                    ),
                    child: const Text("ADD SLOT"),
                  )
                ],
              ),
            );
          },
        );
      },
    );
  }

  Widget _adminStat(String emoji, String value, String label) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: AppTheme.borderLight),
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(emoji, style: const TextStyle(fontSize: 24)),
          const SizedBox(height: 6),
          Text(value, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: AppTheme.textPrimary, letterSpacing: -1)),
          Text(label, textAlign: TextAlign.center, style: const TextStyle(fontSize: 9, fontWeight: FontWeight.w700, color: AppTheme.textSecondary)),
        ],
      ),
    );
  }
}
