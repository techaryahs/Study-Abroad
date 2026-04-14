import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme.dart';
import '../../core/api_client.dart';
import '../auth/auth_provider.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  Map<String, dynamic>? _userData;
  List<dynamic> _receipts = [];
  bool _loading = true;
  String _activeTab = 'about';

  final List<Map<String, String>> _profileCards = [
    {'title': 'Target University', 'icon': '🏛️', 'section': 'targetUniversities'},
    {'title': 'High School', 'icon': '🏫', 'section': 'highSchool'},
    {'title': 'Undergraduate', 'icon': '🎓', 'section': 'underGrad'},
    {'title': "Master's Degree", 'icon': '📜', 'section': 'masters'},
    {'title': 'Test Scores', 'icon': '📊', 'section': 'testScores'},
    {'title': 'Work Experience', 'icon': '💼', 'section': 'workExperience'},
    {'title': 'Research', 'icon': '🔬', 'section': 'research'},
    {'title': 'Projects', 'icon': '🚀', 'section': 'projects'},
    {'title': 'Volunteering', 'icon': '🤝', 'section': 'volunteering'},
  ];

  @override
  void initState() {
    super.initState();
    _fetchData();
  }

  Future<void> _fetchData() async {
    final auth = context.read<AuthProvider>();
    final userId = auth.userId;
    if (userId == null) { setState(() => _loading = false); return; }

    try {
      final profileRes = await ApiClient.instance.get('/api/user/profile/$userId');
      final receiptsRes = await ApiClient.instance.get('/api/payment/user/${auth.user?['email']}');

      if (mounted) {
        setState(() {
          _userData = profileRes.data;
          _receipts = receiptsRes.data is List ? receiptsRes.data : [];
          _loading = false;
        });
      }
    } catch (_) {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    if (_loading) {
      return const Scaffold(
        backgroundColor: AppTheme.background,
        body: Center(child: CircularProgressIndicator(color: AppTheme.gold)),
      );
    }

    final profile = _userData?['profile'] ?? {};
    final name = _userData?['name'] ?? auth.user?['name'] ?? 'Student';
    final completedSteps = _countCompleted(profile);

    return Scaffold(
      backgroundColor: AppTheme.background,
      body: CustomScrollView(
        slivers: [
          // ── HEADER ───────────────────────────────────────
          SliverAppBar(
            expandedHeight: 200,
            pinned: true,
            backgroundColor: AppTheme.darkBrown,
            flexibleSpace: FlexibleSpaceBar(
              background: Container(
                color: AppTheme.darkBrown,
                padding: const EdgeInsets.fromLTRB(20, 80, 20, 20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        // Avatar
                        Container(
                          width: 64, height: 64,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            border: Border.all(color: AppTheme.gold, width: 2),
                          ),
                          child: ClipOval(
                            child: profile['profileImage'] != null
                                ? Image.network(
                                    '${ApiClient.baseUrl}${profile['profileImage']}',
                                    fit: BoxFit.cover,
                                    errorBuilder: (_, __, ___) => _avatarPlaceholder(name),
                                  )
                                : _avatarPlaceholder(name),
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(name,
                                  style: const TextStyle(
                                    color: Colors.white,
                                    fontSize: 20,
                                    fontWeight: FontWeight.w900,
                                    letterSpacing: -0.3,
                                  )),
                              const SizedBox(height: 4),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
                                decoration: BoxDecoration(
                                  color: AppTheme.gold.withOpacity(0.15),
                                  borderRadius: BorderRadius.circular(20),
                                  border: Border.all(color: AppTheme.gold.withOpacity(0.3)),
                                ),
                                child: Text(
                                  (auth.role ?? 'student').toUpperCase(),
                                  style: const TextStyle(color: AppTheme.gold, fontSize: 9, fontWeight: FontWeight.w800, letterSpacing: 1.5),
                                ),
                              ),
                            ],
                          ),
                        ),
                        IconButton(
                          onPressed: () async { await auth.logout(); if (mounted) context.go('/login'); },
                          icon: const Icon(Icons.logout_rounded, color: Colors.white54, size: 20),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ),

          SliverToBoxAdapter(
            child: Column(
              children: [
                // ── PROFILE STRENGTH ──────────────────────
                Container(
                  margin: const EdgeInsets.all(16),
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: AppTheme.borderLight),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text('Profile Strength',
                              style: TextStyle(fontSize: 12, fontWeight: FontWeight.w800, color: AppTheme.textPrimary, letterSpacing: 0.5)),
                          Text('$completedSteps/9',
                              style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w800, color: AppTheme.gold)),
                        ],
                      ),
                      const SizedBox(height: 10),
                      ClipRRect(
                        borderRadius: BorderRadius.circular(4),
                        child: LinearProgressIndicator(
                          value: completedSteps / 9,
                          backgroundColor: AppTheme.borderLight,
                          color: Colors.green,
                          minHeight: 6,
                        ),
                      ),
                    ],
                  ),
                ).animate().fadeIn(duration: 400.ms),

                // ── TABS ─────────────────────────────────
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: Row(
                    children: _buildTabs(profile),
                  ),
                ),
                const SizedBox(height: 16),

                // ── TAB CONTENT ──────────────────────────
                AnimatedSwitcher(
                  duration: const Duration(milliseconds: 300),
                  child: _buildTabContent(profile),
                ),

                // ── PROFILE CARDS ─────────────────────────
                _sectionHeader('Complete Your Profile'),
                GridView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 3,
                    crossAxisSpacing: 10,
                    mainAxisSpacing: 10,
                    childAspectRatio: 0.85,
                  ),
                  itemCount: _profileCards.length,
                  itemBuilder: (_, i) {
                    final card = _profileCards[i];
                    final hasData = _hasData(profile, card['section']!);
                    return Container(
                      decoration: BoxDecoration(
                        color: hasData ? AppTheme.darkBrown.withOpacity(0.05) : Colors.white,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(
                          color: hasData ? AppTheme.gold.withOpacity(0.3) : AppTheme.borderLight,
                        ),
                      ),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(card['icon']!, style: const TextStyle(fontSize: 24)),
                          const SizedBox(height: 6),
                          Text(
                            card['title']!,
                            textAlign: TextAlign.center,
                            style: TextStyle(
                              fontSize: 9,
                              fontWeight: FontWeight.w700,
                              color: hasData ? AppTheme.gold : AppTheme.textSecondary,
                            ),
                          ),
                          if (hasData) ...[
                            const SizedBox(height: 4),
                            const Icon(Icons.check_circle_rounded, color: AppTheme.gold, size: 12),
                          ],
                        ],
                      ),
                    ).animate().fadeIn(delay: Duration(milliseconds: i * 40));
                  },
                ),

                const SizedBox(height: 32),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _avatarPlaceholder(String name) {
    return Container(
      color: AppTheme.gold.withOpacity(0.2),
      child: Center(
        child: Text(
          name.isNotEmpty ? name[0].toUpperCase() : 'U',
          style: const TextStyle(color: AppTheme.gold, fontSize: 24, fontWeight: FontWeight.w900),
        ),
      ),
    );
  }

  List<Widget> _buildTabs(Map<String, dynamic> profile) {
    final tabs = [
      {'id': 'about', 'label': 'About'},
      if ((profile['highSchool'] as List?)?.isNotEmpty ?? false)
        {'id': 'highSchool', 'label': 'High School'},
      if ((profile['underGrad'] as List?)?.isNotEmpty ?? false)
        {'id': 'undergrad', 'label': "Bachelor's"},
      if ((profile['masters'] as List?)?.isNotEmpty ?? false)
        {'id': 'masters', 'label': "Master's"},
      if ((profile['targetUniversities'] as List?)?.isNotEmpty ?? false)
        {'id': 'target', 'label': 'Target'},
      if (_receipts.isNotEmpty)
        {'id': 'bookings', 'label': 'Bookings'},
    ];

    return tabs.map((tab) {
      final isSelected = _activeTab == tab['id'];
      return GestureDetector(
        onTap: () => setState(() => _activeTab = tab['id']!),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          margin: const EdgeInsets.only(right: 8),
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          decoration: BoxDecoration(
            color: isSelected ? AppTheme.gold : Colors.white,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: isSelected ? AppTheme.gold : AppTheme.borderLight),
          ),
          child: Text(
            tab['label']!,
            style: TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.w700,
              color: isSelected ? AppTheme.darkBrown : AppTheme.textSecondary,
            ),
          ),
        ),
      );
    }).toList();
  }

  Widget _buildTabContent(Map<String, dynamic> profile) {
    switch (_activeTab) {
      case 'about':
        return _aboutTab(profile);
      case 'highSchool':
        return _listTab(profile['highSchool'] ?? [], 'schoolName', 'High School', '🏫');
      case 'undergrad':
        return _listTab(profile['underGrad'] ?? [], 'uniName', "Bachelor's", '🎓');
      case 'masters':
        return _listTab(profile['masters'] ?? [], 'uniName', "Master's", '📜');
      case 'target':
        return _listTab(profile['targetUniversities'] ?? [], 'uniName', 'Target Universities', '🏛️');
      case 'bookings':
        return _bookingsTab();
      default:
        return const SizedBox.shrink();
    }
  }

  Widget _aboutTab(Map<String, dynamic> profile) {
    final auth = context.read<AuthProvider>();
    final data = _userData ?? {};
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppTheme.borderLight),
      ),
      child: Column(
        children: [
          _infoRow(Icons.person_outline_rounded, 'Full Name', data['name'] ?? '—'),
          _infoRow(Icons.mail_outline_rounded, 'Email', data['email'] ?? '—'),
          _infoRow(Icons.phone_outlined, 'Phone', data['phone'] ?? '—'),
          _infoRow(Icons.location_on_outlined, 'Country', data['country'] ?? '—'),
          _infoRow(Icons.wc_rounded, 'Gender', data['gender'] ?? '—'),
        ],
      ),
    );
  }

  Widget _infoRow(IconData icon, String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 10),
      child: Row(
        children: [
          Container(
            width: 36, height: 36,
            decoration: BoxDecoration(
              color: AppTheme.background,
              borderRadius: BorderRadius.circular(10),
              border: Border.all(color: AppTheme.borderLight),
            ),
            child: Icon(icon, size: 16, color: AppTheme.gold),
          ),
          const SizedBox(width: 12),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(label.toUpperCase(),
                  style: const TextStyle(fontSize: 8, fontWeight: FontWeight.w800, letterSpacing: 1.5, color: AppTheme.textSecondary)),
              const SizedBox(height: 2),
              Text(value, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: AppTheme.textPrimary)),
            ],
          ),
        ],
      ),
    );
  }

  Widget _listTab(List items, String titleKey, String label, String icon) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        children: items.isEmpty
            ? [Container(
                padding: const EdgeInsets.all(32),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: AppTheme.borderLight),
                ),
                child: Center(
                  child: Text('No $label added yet',
                      style: const TextStyle(fontSize: 12, color: AppTheme.textSecondary)),
                ),
              )]
            : items.map<Widget>((item) => Container(
                margin: const EdgeInsets.only(bottom: 10),
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppTheme.borderLight),
                ),
                child: Row(
                  children: [
                    Text(icon, style: const TextStyle(fontSize: 24)),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(item[titleKey] ?? '—',
                              style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w800, color: AppTheme.textPrimary)),
                          if (item['cgpa'] != null)
                            Text('CGPA: ${item['cgpa']} / ${item['outOf']}',
                                style: const TextStyle(fontSize: 11, color: AppTheme.textSecondary)),
                        ],
                      ),
                    ),
                  ],
                ),
              )).toList(),
      ),
    );
  }

  Widget _bookingsTab() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        children: _receipts.isEmpty
            ? [Container(
                padding: const EdgeInsets.all(32),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: AppTheme.borderLight),
                ),
                child: const Center(
                  child: Text('No purchase history', style: TextStyle(fontSize: 12, color: AppTheme.textSecondary)),
                ),
              )]
            : _receipts.map<Widget>((r) => Container(
                margin: const EdgeInsets.only(bottom: 10),
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppTheme.borderLight),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text('Order: ${r['orderId'] ?? '—'}',
                            style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w800, color: AppTheme.textPrimary)),
                        Text('${r['currency']} ${r['total']}',
                            style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: Colors.red)),
                      ],
                    ),
                    const SizedBox(height: 4),
                    const Text('Paid', style: TextStyle(fontSize: 10, color: Colors.green, fontWeight: FontWeight.w800)),
                  ],
                ),
              )).toList(),
      ),
    );
  }

  Widget _sectionHeader(String text) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 24, 16, 14),
      child: Text(text.toUpperCase(),
          style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w800, letterSpacing: 2, color: AppTheme.gold)),
    );
  }

  int _countCompleted(Map<String, dynamic> profile) {
    int count = 0;
    for (final key in ['highSchool', 'underGrad', 'masters', 'testScores', 'workExperience', 'research', 'projects', 'volunteering', 'targetUniversities']) {
      if ((profile[key] as List?)?.isNotEmpty ?? false) count++;
    }
    return count;
  }

  bool _hasData(Map<String, dynamic> profile, String section) {
    return (profile[section] as List?)?.isNotEmpty ?? false;
  }
}
