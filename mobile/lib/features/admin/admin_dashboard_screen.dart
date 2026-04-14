import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../core/theme.dart';
import '../../core/api_client.dart';
import '../auth/auth_provider.dart';

class AdminDashboardScreen extends StatefulWidget {
  const AdminDashboardScreen({super.key});
  @override
  State<AdminDashboardScreen> createState() => _AdminDashboardScreenState();
}

class _AdminDashboardScreenState extends State<AdminDashboardScreen> {
  Map<String, dynamic> _stats = {};
  List<dynamic> _recentUsers = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _fetchData();
  }

  Future<void> _fetchData() async {
    try {
      final usersRes = await ApiClient.instance.get('/api/admin/users');
      final data = usersRes.data;
      final users = data is List ? data : (data['users'] ?? []);
      setState(() {
        _recentUsers = (users as List).take(5).toList();
        _stats = {
          'totalUsers': users.length,
          'students': users.where((u) => u['role'] == 'student').length,
          'consultants': users.where((u) => u['role'] == 'consultant').length,
        };
        _loading = false;
      });
    } catch (_) {
      setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    return Scaffold(
      backgroundColor: AppTheme.background,
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            pinned: true,
            backgroundColor: AppTheme.darkBrown,
            expandedHeight: 140,
            actions: [
              IconButton(
                icon: const Icon(Icons.logout_rounded, color: Colors.white54),
                onPressed: () async => await auth.logout(),
              ),
            ],
            flexibleSpace: FlexibleSpaceBar(
              background: Container(
                color: AppTheme.darkBrown,
                padding: const EdgeInsets.fromLTRB(20, 80, 20, 20),
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
          ),

          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: _loading
                  ? const Center(child: CircularProgressIndicator(color: AppTheme.gold))
                  : Column(
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
                        const SizedBox(height: 24),
                      ],
                    ),
            ),
          ),
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
          Text(label, style: const TextStyle(fontSize: 9, fontWeight: FontWeight.w700, color: AppTheme.textSecondary)),
        ],
      ),
    );
  }
}
