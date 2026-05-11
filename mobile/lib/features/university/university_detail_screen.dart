import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../../core/api_client.dart';
import '../../core/theme.dart';
import '../../data/university_repository.dart';
import '../auth/auth_provider.dart';

class UniversityDetailScreen extends StatefulWidget {
  final String slug;
  const UniversityDetailScreen({super.key, required this.slug});

  @override
  State<UniversityDetailScreen> createState() => _UniversityDetailScreenState();
}

class _UniversityDetailScreenState extends State<UniversityDetailScreen>
    with SingleTickerProviderStateMixin {
  late Future<UniversityItem?> _universityFuture;
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _universityFuture = UniversityRepository.getUniversityBySlug(widget.slug);
    _tabController = TabController(length: 3, vsync: this);
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<UniversityItem?>(
      future: _universityFuture,
      builder: (context, snapshot) {
        if (!snapshot.hasData) {
          return const Scaffold(
              body: Center(
                  child: CircularProgressIndicator(color: AppTheme.gold)));
        }

        final u = snapshot.data!;
        return Scaffold(
          backgroundColor: AppTheme.background,
          body: CustomScrollView(
            slivers: [
              SliverAppBar(
                expandedHeight: 200,
                pinned: true,
                backgroundColor: AppTheme.background,
                elevation: 0,
                flexibleSpace: FlexibleSpaceBar(
                  background: Stack(
                    fit: StackFit.expand,
                    children: [
                      Container(color: AppTheme.background),
                      Positioned(
                        right: -50,
                        top: -50,
                        child: Container(
                          width: 200,
                          height: 200,
                          decoration: BoxDecoration(
                              color: AppTheme.gold.withValues(alpha: 0.05),
                              shape: BoxShape.circle),
                        ),
                      ),
                      Center(
                        child: Container(
                          width: 100,
                          height: 100,
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(30),
                            boxShadow: [
                              BoxShadow(
                                  color: Colors.black.withValues(alpha: 0.05),
                                  blurRadius: 20)
                            ],
                          ),
                          child: _buildLogo(u.logo),
                        ),
                      ),
                    ],
                  ),
                ),
                leading: IconButton(
                  icon: const Icon(LucideIcons.arrowLeft,
                      color: AppTheme.textPrimary),
                  onPressed: () => context.canPop()
                      ? context.pop()
                      : context.go('/universities'),
                ),
              ),
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.all(24),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                                color: AppTheme.gold.withValues(alpha: 0.1),
                                borderRadius: BorderRadius.circular(8)),
                            child: Text('#${u.rank}',
                                style: const TextStyle(
                                    color: AppTheme.gold,
                                    fontSize: 14,
                                    fontWeight: FontWeight.w900,
                                    letterSpacing: 1)),
                          ),
                          const Icon(LucideIcons.share2,
                              size: 20, color: AppTheme.textSecondary),
                        ],
                      ),
                      const SizedBox(height: 16),
                      Text(u.name,
                          style: const TextStyle(
                              fontFamily: 'Cormorant Garamond',
                              fontSize: 36,
                              fontWeight: FontWeight.w900,
                              height: 1.1,
                              color: AppTheme.textPrimary)),
                      const SizedBox(height: 12),
                      Row(
                        children: [
                          const Icon(LucideIcons.mapPin,
                              size: 14, color: AppTheme.gold),
                          const SizedBox(width: 8),
                          Text(u.fullLocation,
                              style: const TextStyle(
                                  color: AppTheme.textSecondary,
                                  fontWeight: FontWeight.w500)),
                        ],
                      ),
                      const SizedBox(height: 40),
                      TabBar(
                        controller: _tabController,
                        labelColor: AppTheme.textPrimary,
                        unselectedLabelColor: AppTheme.textSecondary,
                        indicatorColor: AppTheme.gold,
                        indicatorSize: TabBarIndicatorSize.label,
                        labelStyle: const TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w900,
                            letterSpacing: 1),
                        tabs: const [
                          Tab(text: 'OVERVIEW'),
                          Tab(text: 'ACADEMICS'),
                          Tab(text: 'COSTS'),
                        ],
                      ),
                      SizedBox(
                        height:
                            800, // Fixed height for tab content in a scrollview
                        child: TabBarView(
                          controller: _tabController,
                          children: [
                            _overviewTab(u),
                            _academicsTab(u),
                            _costsTab(u),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
          bottomNavigationBar: _AdmissionChanceBar(university: u),
        );
      },
    );
  }

  Widget _overviewTab(UniversityItem u) {
    return Padding(
      padding: const EdgeInsets.only(top: 32),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('About',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900)),
          const SizedBox(height: 16),
          Text(u.about,
              style: const TextStyle(
                  color: AppTheme.textSecondary, height: 1.8, fontSize: 14)),
          const SizedBox(height: 40),
          _featureCard(LucideIcons.sparkles, 'Top Ranked Programs',
              'Highly selective and research-backed curricula.'),
          const SizedBox(height: 16),
          _featureCard(LucideIcons.globe, 'Global Recognition',
              'Degrees from this institution are respected worldwide.'),
          const SizedBox(height: 40),
          _offerCard(),
        ],
      ),
    );
  }

  Widget _academicsTab(UniversityItem u) {
    return Padding(
      padding: const EdgeInsets.only(top: 32),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Admission Standards',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900)),
          const SizedBox(height: 32),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _circleProgress(0.70, '70%', 'Selective Admission'),
              _circleProgress(0.12, '12%', 'Global Admit Rate'),
            ],
          ),
          const SizedBox(height: 48),
          const Text('Academic Benchmarks',
              style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w900,
                  letterSpacing: 1,
                  color: AppTheme.textSecondary)),
          const SizedBox(height: 24),
          _metricRow('Avg. CGPA', '8.5 / 10'),
          _divider(),
          _metricRow('Avg. GRE', '320+'),
          _divider(),
          _metricRow('Min. TOEFL', '100+'),
        ],
      ),
    );
  }

  Widget _costsTab(UniversityItem u) {
    return Padding(
      padding: const EdgeInsets.only(top: 32),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Financial Estimations',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900)),
          const SizedBox(height: 24),
          _costCard('Approx. Annual Tuition', u.fee, LucideIcons.graduationCap),
          const SizedBox(height: 16),
          _costCard('Living Expenses', 'Variable', LucideIcons.home),
          const SizedBox(height: 16),
          _costCard('Health Insurance', '\$1,200', LucideIcons.heartPulse),
        ],
      ),
    );
  }

  Widget _metricRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 16),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label,
              style: const TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                  color: AppTheme.textSecondary)),
          Text(value,
              style: const TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w900,
                  color: AppTheme.textPrimary)),
        ],
      ),
    );
  }

  Widget _divider() => Divider(color: AppTheme.gold.withValues(alpha: 0.1));

  Widget _circleProgress(double val, String perc, String label) {
    return Column(
      children: [
        Stack(
          alignment: Alignment.center,
          children: [
            SizedBox(
              width: 80,
              height: 80,
              child: CircularProgressIndicator(
                value: val,
                strokeWidth: 8,
                backgroundColor: AppTheme.gold.withValues(alpha: 0.1),
                color: AppTheme.gold,
              ),
            ),
            Text(perc,
                style:
                    const TextStyle(fontSize: 14, fontWeight: FontWeight.w900)),
          ],
        ),
        const SizedBox(height: 16),
        Text(label,
            style: const TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w700,
                color: AppTheme.textSecondary)),
      ],
    );
  }

  Widget _featureCard(IconData icon, String title, String desc) {
    return Row(
      children: [
        Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
              color: AppTheme.gold.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(12)),
          child: Icon(icon, color: AppTheme.gold, size: 20),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title,
                  style: const TextStyle(
                      fontSize: 14, fontWeight: FontWeight.bold)),
              const SizedBox(height: 4),
              Text(desc,
                  style: const TextStyle(
                      fontSize: 14, color: AppTheme.textSecondary)),
            ],
          ),
        ),
      ],
    );
  }

  Widget _costCard(String label, String value, IconData icon) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppTheme.gold.withValues(alpha: 0.1)),
      ),
      child: Row(
        children: [
          Icon(icon, color: AppTheme.gold, size: 20),
          const SizedBox(width: 16),
          Expanded(
              child: Text(label,
                  style: const TextStyle(
                      fontSize: 13, fontWeight: FontWeight.w500))),
          Text(value,
              style: const TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w900,
                  color: AppTheme.gold)),
        ],
      ),
    );
  }

  Widget _offerCard() {
    return Container(
      padding: const EdgeInsets.all(32),
      decoration: BoxDecoration(
        color: Colors.black,
        borderRadius: BorderRadius.circular(30),
      ),
      child: Column(
        children: [
          const Text('Exclusive Offer',
              style: TextStyle(
                  color: Colors.white54,
                  fontSize: 14,
                  fontWeight: FontWeight.w900,
                  letterSpacing: 2)),
          const SizedBox(height: 12),
          const Text('Secure your spot today',
              textAlign: TextAlign.center,
              style: TextStyle(
                  color: Colors.white,
                  fontSize: 20,
                  fontWeight: FontWeight.w900)),
          const SizedBox(height: 24),
          ElevatedButton(
            onPressed: () {},
            style: ElevatedButton.styleFrom(
                backgroundColor: AppTheme.gold,
                foregroundColor: Colors.white,
                minimumSize: const Size(double.infinity, 56),
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16))),
            child: const Text('APPLY WITH PRIORITY',
                style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w900,
                    letterSpacing: 1)),
          ),
          const SizedBox(height: 12),
          TextButton(
            onPressed: () {},
            child: const Text('Speak with Counsellor',
                style: TextStyle(color: Colors.white70, fontSize: 14)),
          ),
        ],
      ),
    );
  }

  Widget _buildLogo(String? path) {
    if (path == null) {
      return const Icon(LucideIcons.graduationCap,
          color: AppTheme.gold, size: 40);
    }
    if (path.startsWith('http')) {
      return Image.network(path,
          fit: BoxFit.contain,
          errorBuilder: (_, __, ___) =>
              const Icon(LucideIcons.graduationCap, color: AppTheme.gold));
    }
    return Image.asset(path,
        fit: BoxFit.contain,
        errorBuilder: (_, __, ___) =>
            const Icon(LucideIcons.graduationCap, color: AppTheme.gold));
  }
}

class _AdmissionChanceBar extends StatefulWidget {
  final UniversityItem university;

  const _AdmissionChanceBar({required this.university});

  @override
  State<_AdmissionChanceBar> createState() => _AdmissionChanceBarState();
}

class _AdmissionChanceBarState extends State<_AdmissionChanceBar> {
  Future<Map<String, dynamic>?>? _profileFuture;
  String? _profileUserId;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final auth = Provider.of<AuthProvider>(context);
    if (_profileUserId != auth.userId) {
      _profileUserId = auth.userId;
      _profileFuture = _loadProfile(auth);
    }
  }

  Future<Map<String, dynamic>?> _loadProfile(AuthProvider auth) async {
    final userId = auth.userId;
    if (userId == null || userId.isEmpty) {
      return auth.user == null ? null : Map<String, dynamic>.from(auth.user!);
    }

    try {
      final response =
          await ApiClient.instance.get('/api/user/profile/$userId');
      if (response.data is Map) {
        return Map<String, dynamic>.from(response.data as Map);
      }
    } catch (_) {
      // Fall back to the auth snapshot so the CTA still works offline.
    }

    return auth.user == null ? null : Map<String, dynamic>.from(auth.user!);
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();

    return FutureBuilder<Map<String, dynamic>?>(
      future: _profileFuture,
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return _barShell(
            child: const Row(
              children: [
                SizedBox(
                  width: 22,
                  height: 22,
                  child: CircularProgressIndicator(
                      color: AppTheme.gold, strokeWidth: 2.5),
                ),
                SizedBox(width: 14),
                Expanded(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'ANALYZING PROFILE',
                        style: TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w900,
                            color: AppTheme.textSecondary),
                      ),
                      SizedBox(height: 4),
                      Text(
                        'Loading academic details',
                        style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w700,
                            color: AppTheme.textPrimary),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          );
        }

        final userData = snapshot.data ?? auth.user;
        final profile = _profileFrom(userData);
        final hasAcademicData = _bestAcademicPercentage(profile) != null;

        if (!hasAcademicData) {
          return _barShell(
            child: Row(
              children: [
                const Expanded(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'WANT TO KNOW YOUR CHANCES?',
                        style: TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w900,
                            color: AppTheme.textSecondary),
                      ),
                      SizedBox(height: 4),
                      Text(
                        'Add your academics to evaluate this university.',
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w700,
                            color: AppTheme.textPrimary),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 12),
                _actionButton(
                  label: 'ADD DETAILS',
                  onPressed: () => _openProfileEditor(userData, auth),
                ),
              ],
            ),
          );
        }

        final chance = _calculateAdmissionChance(profile, widget.university);
        final label = _chanceLabel(chance);
        final color = _chanceColor(chance);

        return _barShell(
          child: Row(
            children: [
              Expanded(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'ESTIMATED CHANCE',
                      style: TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w900,
                          color: AppTheme.textSecondary),
                    ),
                    const SizedBox(height: 4),
                    Row(
                      children: [
                        Text(
                          '$chance%',
                          style: const TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.w900,
                              color: AppTheme.gold),
                        ),
                        const SizedBox(width: 8),
                        Flexible(
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 6, vertical: 2),
                            decoration: BoxDecoration(
                              color: color.withValues(alpha: 0.1),
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: Text(
                              label,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w900,
                                  color: color),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 12),
              _actionButton(
                label: 'RE-EVALUATE',
                onPressed: () => _refreshProfile(auth),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _barShell({required Widget child}) {
    return Container(
      padding: const EdgeInsets.fromLTRB(24, 16, 24, 40),
      decoration: const BoxDecoration(
        color: Colors.white,
        border: Border(top: BorderSide(color: AppTheme.borderLight)),
      ),
      child: SafeArea(top: false, child: child),
    );
  }

  Widget _actionButton(
      {required String label, required VoidCallback onPressed}) {
    return ConstrainedBox(
      constraints: const BoxConstraints(maxWidth: 150),
      child: ElevatedButton(
        onPressed: onPressed,
        style: ElevatedButton.styleFrom(
          backgroundColor: AppTheme.darkBrown,
          foregroundColor: Colors.white,
          shape:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 16),
        ),
        child: Text(
          label,
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
          style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w900),
        ),
      ),
    );
  }

  Future<void> _openProfileEditor(
      Map<String, dynamic>? userData, AuthProvider auth) async {
    final data = userData ?? auth.user;
    if (data == null) {
      context.go('/dashboard');
      return;
    }

    final updated = await context.push('/dashboard/edit', extra: data);
    if (!mounted) return;

    if (updated == true) {
      _refreshProfile(auth);
    }
  }

  void _refreshProfile(AuthProvider auth) {
    setState(() {
      _profileFuture = _loadProfile(auth);
    });
  }

  Map<String, dynamic> _profileFrom(Map<String, dynamic>? userData) {
    final profile = userData?['profile'];
    return profile is Map
        ? Map<String, dynamic>.from(profile)
        : <String, dynamic>{};
  }

  int _calculateAdmissionChance(
      Map<String, dynamic> profile, UniversityItem university) {
    final academicPercentage = _bestAcademicPercentage(profile);
    if (academicPercentage == null) return 0;

    final stats = _UniversityAdmissionStats.fromUniversity(university);
    final userGpaFourScale = (academicPercentage / 100) * 4;
    final expectedGpa = stats.avgGpa ?? 3.2;

    var chance = stats.acceptanceRate + ((userGpaFourScale - expectedGpa) * 16);
    chance += _testScoreAdjustment(profile, stats);
    chance += _profileDepthBoost(profile);

    return chance.clamp(2, 95).round();
  }

  double? _bestAcademicPercentage(Map<String, dynamic> profile) {
    final scores = <double>[];

    for (final section in ['masters', 'underGrad', 'highSchool']) {
      final items = profile[section];
      if (items is! List) continue;

      for (final item in items.whereType<Map>()) {
        final percentage = _academicPercentageFromItem(item);
        if (percentage != null) scores.add(percentage);
      }
    }

    if (scores.isEmpty) return null;
    scores.sort();
    return scores.last;
  }

  double? _academicPercentageFromItem(Map item) {
    final value = _doubleValue(item['cgpa']);
    if (value == null || value <= 0) return null;

    final outOf = _doubleValue(item['outOf']);
    if (outOf != null && outOf > 0) {
      return ((value / outOf) * 100).clamp(0, 100);
    }

    if (value <= 10) return (value * 10).clamp(0, 100);
    return value.clamp(0, 100);
  }

  double _testScoreAdjustment(
      Map<String, dynamic> profile, _UniversityAdmissionStats stats) {
    final scores = profile['testScores'];
    if (scores is! List || scores.isEmpty) return 0;

    final adjustments = <double>[];
    for (final score in scores.whereType<Map>()) {
      final type = score['testType']?.toString().toLowerCase() ?? '';
      final value = _doubleValue(score['score']);
      if (value == null) continue;

      if (type.contains('gre') && stats.avgGre != null) {
        adjustments.add(((value - stats.avgGre!) / 20) * 8);
      } else if (type.contains('gmat') && stats.avgGmat != null) {
        adjustments.add(((value - stats.avgGmat!) / 80) * 8);
      } else if (type.contains('toefl')) {
        final target = stats.toeflMin ?? 90;
        adjustments.add(((value - target) / 20) * 6);
      } else if (type.contains('ielts')) {
        final target = stats.ieltsMin ?? 6.5;
        adjustments.add(((value - target) / 1.5) * 6);
      }
    }

    if (adjustments.isEmpty) return 0;
    adjustments.sort();
    return adjustments.last.clamp(-8, 10);
  }

  double _profileDepthBoost(Map<String, dynamic> profile) {
    var boost = 0.0;
    if (_hasEntries(profile, 'research')) boost += 4;
    if (_hasEntries(profile, 'workExperience')) boost += 3;
    if (_hasEntries(profile, 'projects')) boost += 2;
    if (_hasEntries(profile, 'masters')) boost += 2;
    if (_hasEntries(profile, 'volunteering')) boost += 1;
    if (_hasEntries(profile, 'targetUniversities')) boost += 1;
    return boost.clamp(0, 10);
  }

  bool _hasEntries(Map<String, dynamic> profile, String key) {
    final value = profile[key];
    return value is List && value.isNotEmpty;
  }

  double? _doubleValue(dynamic value) {
    if (value is num) return value.toDouble();
    return double.tryParse(value?.toString().replaceAll('%', '').trim() ?? '');
  }

  String _chanceLabel(int chance) {
    if (chance >= 65) return 'STRONG';
    if (chance >= 40) return 'COMPETITIVE';
    if (chance >= 20) return 'REACH';
    return 'AMBITIOUS';
  }

  Color _chanceColor(int chance) {
    if (chance >= 65) return const Color(0xFF10B981);
    if (chance >= 40) return AppTheme.gold;
    if (chance >= 20) return const Color(0xFFF59E0B);
    return const Color(0xFFEF4444);
  }
}

class _UniversityAdmissionStats {
  final double acceptanceRate;
  final double? avgGpa;
  final double? avgGre;
  final double? avgGmat;
  final double? toeflMin;
  final double? ieltsMin;

  const _UniversityAdmissionStats({
    required this.acceptanceRate,
    this.avgGpa,
    this.avgGre,
    this.avgGmat,
    this.toeflMin,
    this.ieltsMin,
  });

  factory _UniversityAdmissionStats.fromUniversity(UniversityItem university) {
    final acceptanceRates = <double>[];
    final gpas = <double>[];
    final gres = <double>[];
    final gmats = <double>[];
    final toeflMinimums = <double>[];
    final ieltsMinimums = <double>[];

    for (final branch in university.branches ?? const []) {
      if (branch is! Map) continue;

      final stats = branch['stats'];
      if (stats is Map) {
        _addNumber(acceptanceRates, stats['acceptance_rate']);
        _addNumber(gpas, stats['avg_gpa']);
        _addNumber(gres, stats['avg_gre']);
        _addNumber(gmats, stats['avg_gmat']);
      }

      final admittedProfiles = branch['admitted_profiles'];
      if (admittedProfiles is Map) {
        _addNumber(toeflMinimums, admittedProfiles['toefl_min']);
        _addNumber(ieltsMinimums, admittedProfiles['ielts_min']);
      }
    }

    return _UniversityAdmissionStats(
      acceptanceRate: _average(acceptanceRates) ?? 35,
      avgGpa: _average(gpas),
      avgGre: _average(gres),
      avgGmat: _average(gmats),
      toeflMin: _average(toeflMinimums),
      ieltsMin: _average(ieltsMinimums),
    );
  }

  static void _addNumber(List<double> values, dynamic value) {
    final parsed = value is num
        ? value.toDouble()
        : double.tryParse(value?.toString() ?? '');
    if (parsed != null) values.add(parsed);
  }

  static double? _average(List<double> values) {
    if (values.isEmpty) return null;
    return values.reduce((a, b) => a + b) / values.length;
  }
}
