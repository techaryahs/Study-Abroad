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

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
    _fetchUsersData();
    _fetchSessionsData();
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
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
      final dateStr = session['date']?.toString();
      final timeStr = session['endTime']?.toString();
      if (dateStr == null) return false;
      
      final parts = dateStr.split('/');
      if (parts.length == 3) {
        final year = parts[2].padLeft(4, '0');
        final month = parts[1].padLeft(2, '0');
        final day = parts[0].padLeft(2, '0');
        
        DateTime dt = DateTime.parse('$year-$month-$day');
        if (timeStr != null) {
          final timePartsStr = timeStr.split(RegExp(r'[\s:]')); 
          if (timePartsStr.length >= 2) {
             final h = int.parse(timePartsStr[0]);
             final m = int.parse(timePartsStr[1]);
             int hr = h;
             if (timeStr.toLowerCase().contains('pm') && h != 12) hr += 12;
             if (timeStr.toLowerCase().contains('am') && h == 12) hr = 0;
             dt = DateTime(int.parse(year), int.parse(month), int.parse(day), hr, m);
          }
        }
        return dt.isBefore(DateTime.now());
      }
      return false;
    } catch (_) {
      return false;
    }
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    
    final activeSessions = _sessions.where((s) {
      final status = s['status']?.toString().toLowerCase();
      return status == 'booked' && !_isSessionPast(s);
    }).toList();
    
    final pastSessions = _sessions.where((s) {
      final status = s['status']?.toString().toLowerCase();
      return status == 'completed' || status == 'cancelled' || _isSessionPast(s);
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
                const Tab(text: 'Users Summary'),
              ],
            ),
          ),

          SliverFillRemaining(
            child: TabBarView(
              controller: _tabController,
              children: [
                _buildActiveSessions(activeSessions),
                _buildPastSessions(pastSessions),
                _buildUserStats(),
              ],
            ),
          ),
        ],
      ),
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

  Widget _buildUserStats() {
    if (_loadingUsers) {
      return const Center(child: CircularProgressIndicator(color: AppTheme.gold));
    }
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Stats grid
          GridView.count(
            crossAxisCount: 3,
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            crossAxisSpacing: 10,
            mainAxisSpacing: 10,
            childAspectRatio: 1.0,
            children: [
              _adminStat('👥', '${_stats['totalUsers'] ?? 0}', 'Total Users'),
              _adminStat('🎓', '${_stats['students'] ?? 0}', 'Students'),
              _adminStat('🧑‍💼', '${_stats['consultants'] ?? 0}', 'Consultants'),
            ],
          ).animate().fadeIn(duration: 400.ms),

          const SizedBox(height: 24),

          const Text('RECENT USERS',
              style: TextStyle(fontSize: 10, fontWeight: FontWeight.w800, letterSpacing: 2, color: AppTheme.gold)),
          const SizedBox(height: 14),

          ..._recentUsers.asMap().entries.map((e) {
            final u = e.value;
            return Container(
              margin: const EdgeInsets.only(bottom: 10),
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppTheme.borderLight),
              ),
              child: Row(
                children: [
                  Container(
                    width: 40, height: 40,
                    decoration: BoxDecoration(
                      color: AppTheme.gold.withOpacity(0.1),
                      shape: BoxShape.circle,
                    ),
                    child: Center(
                      child: Text(
                        (u['name'] ?? 'U').toString().isNotEmpty ? (u['name'] ?? 'U').toString()[0].toUpperCase() : 'U',
                        style: const TextStyle(fontWeight: FontWeight.w900, color: AppTheme.gold, fontSize: 16),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(u['name'] ?? '—',
                            style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w800, color: AppTheme.textPrimary)),
                        Text(u['email'] ?? '—',
                            style: const TextStyle(fontSize: 11, color: AppTheme.textSecondary)),
                      ],
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: AppTheme.gold.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      (u['role'] ?? 'user').toString().toUpperCase(),
                      style: const TextStyle(fontSize: 9, fontWeight: FontWeight.w800, color: AppTheme.gold),
                    ),
                  ),
                ],
              ),
            ).animate().fadeIn(delay: Duration(milliseconds: e.key * 50));
          }),
        ],
      ),
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
