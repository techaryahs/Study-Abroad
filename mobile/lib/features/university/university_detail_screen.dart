import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme.dart';
import '../../data/university_repository.dart';

class UniversityDetailScreen extends StatefulWidget {
  final String slug;
  const UniversityDetailScreen({super.key, required this.slug});

  @override
  State<UniversityDetailScreen> createState() => _UniversityDetailScreenState();
}

class _UniversityDetailScreenState extends State<UniversityDetailScreen> with SingleTickerProviderStateMixin {
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
          return const Scaffold(body: Center(child: CircularProgressIndicator(color: AppTheme.gold)));
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
                          decoration: BoxDecoration(color: AppTheme.gold.withOpacity(0.05), shape: BoxShape.circle),
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
                            boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 20)],
                          ),
                          child: _buildLogo(u.logo),
                        ),
                      ),
                    ],
                  ),
                ),
                leading: IconButton(
                  icon: const Icon(LucideIcons.arrowLeft, color: AppTheme.textPrimary),
                  onPressed: () => context.pop(),
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
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(color: AppTheme.gold.withOpacity(0.1), borderRadius: BorderRadius.circular(8)),
                            child: Text('#${u.rank}', style: const TextStyle(color: AppTheme.gold, fontSize: 10, fontWeight: FontWeight.w900, letterSpacing: 1)),
                          ),
                          const Icon(LucideIcons.share2, size: 20, color: AppTheme.textSecondary),
                        ],
                      ),
                      const SizedBox(height: 16),
                      Text(u.name, style: const TextStyle(fontFamily: 'Cormorant Garamond', fontSize: 36, fontWeight: FontWeight.w900, height: 1.1, color: AppTheme.textPrimary)),
                      const SizedBox(height: 12),
                      Row(
                        children: [
                          const Icon(LucideIcons.mapPin, size: 14, color: AppTheme.gold),
                          const SizedBox(width: 8),
                          Text(u.fullLocation, style: const TextStyle(color: AppTheme.textSecondary, fontWeight: FontWeight.w500)),
                        ],
                      ),
                      
                      const SizedBox(height: 40),
                      
                      TabBar(
                        controller: _tabController,
                        labelColor: AppTheme.textPrimary,
                        unselectedLabelColor: AppTheme.textSecondary,
                        indicatorColor: AppTheme.gold,
                        indicatorSize: TabBarIndicatorSize.label,
                        labelStyle: const TextStyle(fontSize: 12, fontWeight: FontWeight.w900, letterSpacing: 1),
                        tabs: const [
                          Tab(text: 'OVERVIEW'),
                          Tab(text: 'ACADEMICS'),
                          Tab(text: 'COSTS'),
                        ],
                      ),
                      
                      SizedBox(
                        height: 800, // Fixed height for tab content in a scrollview
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
          bottomNavigationBar: _bottomCTA(),
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
          const Text('About', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900)),
          const SizedBox(height: 16),
          Text(u.about, style: const TextStyle(color: AppTheme.textSecondary, height: 1.8, fontSize: 14)),
          const SizedBox(height: 40),
          _featureCard(LucideIcons.sparkles, 'Top Ranked Programs', 'Highly selective and research-backed curricula.'),
          const SizedBox(height: 16),
          _featureCard(LucideIcons.globe, 'Global Recognition', 'Degrees from this institution are respected worldwide.'),
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
          const Text('Admission Standards', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900)),
          const SizedBox(height: 32),
          
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _circleProgress(0.70, '70%', 'Selective Admission'),
              _circleProgress(0.12, '12%', 'Global Admit Rate'),
            ],
          ),
          
          const SizedBox(height: 48),
          
          const Text('Academic Benchmarks', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w900, letterSpacing: 1, color: AppTheme.textSecondary)),
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
          const Text('Financial Estimations', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900)),
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
          Text(label, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: AppTheme.textSecondary)),
          Text(value, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w900, color: AppTheme.textPrimary)),
        ],
      ),
    );
  }

  Widget _divider() => Divider(color: AppTheme.gold.withOpacity(0.1));

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
                backgroundColor: AppTheme.gold.withOpacity(0.1),
                color: AppTheme.gold,
              ),
            ),
            Text(perc, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w900)),
          ],
        ),
        const SizedBox(height: 16),
        Text(label, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: AppTheme.textSecondary)),
      ],
    );
  }

  Widget _featureCard(IconData icon, String title, String desc) {
    return Row(
      children: [
        Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(color: AppTheme.gold.withOpacity(0.1), borderRadius: BorderRadius.circular(12)),
          child: Icon(icon, color: AppTheme.gold, size: 20),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
              const SizedBox(height: 4),
              Text(desc, style: const TextStyle(fontSize: 12, color: AppTheme.textSecondary)),
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
        border: Border.all(color: AppTheme.gold.withOpacity(0.1)),
      ),
      child: Row(
        children: [
          Icon(icon, color: AppTheme.gold, size: 20),
          const SizedBox(width: 16),
          Expanded(child: Text(label, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w500))),
          Text(value, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w900, color: AppTheme.gold)),
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
          const Text('Exclusive Offer', style: TextStyle(color: Colors.white54, fontSize: 10, fontWeight: FontWeight.w900, letterSpacing: 2)),
          const SizedBox(height: 12),
          const Text('Secure your spot today', textAlign: TextAlign.center, style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.w900)),
          const SizedBox(height: 24),
          ElevatedButton(
            onPressed: () {},
            style: ElevatedButton.styleFrom(backgroundColor: AppTheme.gold, foregroundColor: Colors.white, minimumSize: const Size(double.infinity, 56), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16))),
            child: const Text('APPLY WITH PRIORITY', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w900, letterSpacing: 1)),
          ),
          const SizedBox(height: 12),
          TextButton(
            onPressed: () {},
            child: const Text('Speak with Counsellor', style: TextStyle(color: Colors.white70, fontSize: 12)),
          ),
        ],
      ),
    );
  }

  Widget _bottomCTA() {
    return Container(
      padding: const EdgeInsets.fromLTRB(24, 16, 24, 40),
      decoration: const BoxDecoration(color: Colors.white, border: Border(top: BorderSide(color: AppTheme.borderLight))),
      child: Row(
        children: [
          Expanded(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('ESTIMATED CHANCE', style: TextStyle(fontSize: 9, fontWeight: FontWeight.w900, color: AppTheme.textSecondary)),
                const SizedBox(height: 4),
                Row(
                  children: [
                    const Text('78%', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w900, color: AppTheme.gold)),
                    const SizedBox(width: 8),
                    Container(padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2), decoration: BoxDecoration(color: const Color(0xFF10B981).withOpacity(0.1), borderRadius: BorderRadius.circular(4)), child: const Text('EXCELLENT', style: TextStyle(fontSize: 8, fontWeight: FontWeight.w900, color: Color(0xFF10B981)))),
                  ],
                ),
              ],
            ),
          ),
          ElevatedButton(
            onPressed: () => context.push('/universities/unipredict'),
            style: ElevatedButton.styleFrom(backgroundColor: AppTheme.darkBrown, foregroundColor: Colors.white, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)), padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16)),
            child: const Text('RELOAD DATA', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900)),
          ),
        ],
      ),
    );
  }

  Widget _buildLogo(String? path) {
    if (path == null) return const Icon(LucideIcons.graduationCap, color: AppTheme.gold, size: 40);
    if (path.startsWith('http')) {
      return Image.network(path, fit: BoxFit.contain, errorBuilder: (_, __, ___) => const Icon(LucideIcons.graduationCap, color: AppTheme.gold));
    }
    return Image.asset(path, fit: BoxFit.contain, errorBuilder: (_, __, ___) => const Icon(LucideIcons.graduationCap, color: AppTheme.gold));
  }
}
