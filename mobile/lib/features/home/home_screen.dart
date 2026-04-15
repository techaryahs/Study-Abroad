import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:country_flags/country_flags.dart';
import '../../core/theme.dart';
import '../../widgets/book_counselling_sheet.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final PageController _carouselCtrl = PageController();
  int _carouselIndex = 0;

  final List<Map<String, String>> _services = [
    {'title': 'Admission Guidance', 'icon': '🏛️', 'route': '/services'},
    {'title': 'University Shortlisting', 'icon': '📋', 'route': '/services'},
    {'title': 'SOP & LOR Support', 'icon': '✍️', 'route': '/services'},
    {'title': 'Scholarship Assistance', 'icon': '🎓', 'route': '/services'},
    {'title': 'Visa Guidance', 'icon': '🛂', 'route': '/services'},
    {'title': 'Profile Building', 'icon': '📈', 'route': '/services'},
  ];

  final List<Map<String, String>> _countries = [
    {'name': 'USA', 'code': 'US'},
    {'name': 'UK', 'code': 'GB'},
    {'name': 'Germany', 'code': 'DE'},
    {'name': 'Australia', 'code': 'AU'},
    {'name': 'Ireland', 'code': 'IE'},
    {'name': 'Dubai', 'code': 'AE'},
    {'name': 'Canada', 'code': 'CA'},
  ];

  final List<Map<String, String>> _stats = [
    {'value': '15+', 'label': 'Countries'},
    {'value': '360+', 'label': 'Top Universities'},
    {'value': '1000+', 'label': 'Admits Received'},
    {'value': '500+', 'label': 'Tier 1 Institutes'},
  ];

  final List<Map<String, String>> _dreams = [
    {'code': 'US', 'name': 'USA', 'stat': '₹2Cr', 'sub': 'Scholarship'},
    {'code': 'GB', 'name': 'UK', 'stat': 'Merit', 'sub': 'Honors Awards'},
    {'code': 'DE', 'name': 'GER', 'stat': 'Full', 'sub': 'Scholarship'},
    {'code': 'AU', 'name': 'AUS', 'stat': '50%', 'sub': 'Fee Waiver'},
  ];

  final List<Color> _carouselColors = [
    const Color(0xFFFAF9F6), // Alabaster
    const Color(0xFFFDFBF7), // Cream
    const Color(0xFFF5F1E9), // Champagne
    const Color(0xFFFFFDF9), // Shell
  ];

  @override
  void initState() {
    super.initState();
    _startCarousel();
  }

  void _startCarousel() {
    Future.delayed(const Duration(seconds: 3), () {
      if (!mounted) return;
      final next = (_carouselIndex + 1) % _carouselColors.length;
      _carouselCtrl.animateToPage(
        next,
        duration: const Duration(milliseconds: 600),
        curve: Curves.easeInOut,
      );
      setState(() => _carouselIndex = next);
      _startCarousel();
    });
  }

  @override
  void dispose() {
    _carouselCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      body: CustomScrollView(
        slivers: [
          // ── APP BAR ──────────────────────────────────────────
          SliverAppBar(
            expandedHeight: 0,
            pinned: true,
            backgroundColor: Colors.white,
            elevation: 0,
            title: Row(
              children: [
                Container(
                  width: 32, height: 32,
                  decoration: BoxDecoration(
                    color: AppTheme.darkBrown,
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: const Icon(Icons.school_rounded, color: AppTheme.gold, size: 18),
                ),
                const SizedBox(width: 10),
                const Text('Study Abroad',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: AppTheme.textPrimary)),
              ],
            ),
            actions: [
              IconButton(
                icon: const Icon(Icons.shopping_cart_outlined, color: AppTheme.textPrimary),
                onPressed: () => context.go('/cart'),
              ),
            ],
          ),

          SliverToBoxAdapter(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [

                // ── HERO CARD ─────────────────────────────────
                Container(
                  margin: const EdgeInsets.all(16),
                  height: 260,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(28),
                    border: Border.all(color: AppTheme.borderLight),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.05),
                        blurRadius: 30,
                        offset: const Offset(0, 10),
                      ),
                    ],
                  ),
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(28),
                    child: Stack(
                      children: [
                        // Animated background
                        PageView.builder(
                          controller: _carouselCtrl,
                          itemCount: _carouselColors.length,
                          itemBuilder: (_, i) => Container(
                            decoration: BoxDecoration(
                              gradient: LinearGradient(
                                begin: Alignment.topLeft,
                                end: Alignment.bottomRight,
                                colors: [_carouselColors[i], Colors.white.withOpacity(0.9)],
                              ),
                            ),
                          ),
                        ),

                        // Gold pattern overlay
                        Positioned.fill(
                          child: CustomPaint(painter: _GoldPatternPainter()),
                        ),

                        // Content
                        Padding(
                          padding: const EdgeInsets.all(24),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                                decoration: BoxDecoration(
                                  color: AppTheme.gold.withOpacity(0.1),
                                  borderRadius: BorderRadius.circular(20),
                                  border: Border.all(color: AppTheme.gold.withOpacity(0.3)),
                                ),
                                child: const Text(
                                  '✦  EDUCATION LEADER',
                                  style: TextStyle(
                                    color: AppTheme.gold,
                                    fontSize: 9,
                                    fontWeight: FontWeight.w800,
                                    letterSpacing: 2,
                                  ),
                                ),
                              ),
                              const SizedBox(height: 16),
                              const Text(
                                'Led Path to\nIvy League &\nTop Global\nUniversities',
                                style: TextStyle(
                                  color: AppTheme.textPrimary,
                                  fontSize: 26,
                                  fontWeight: FontWeight.w900,
                                  height: 1.1,
                                  letterSpacing: -0.5,
                                ),
                              ),
                              const Spacer(),
                              Row(
                                children: [
                                  Expanded(
                                    child: ElevatedButton(
                                      onPressed: () => showBookCounsellingSheet(context),
                                      style: ElevatedButton.styleFrom(
                                        backgroundColor: AppTheme.gold,
                                        foregroundColor: Colors.white,
                                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                                        padding: const EdgeInsets.symmetric(vertical: 12),
                                        textStyle: const TextStyle(fontSize: 11, fontWeight: FontWeight.w800, letterSpacing: 1),
                                      ),
                                      child: const Text('TALK TO EXPERT'),
                                    ),
                                  ),
                                  const SizedBox(width: 12),
                                  Expanded(
                                    child: OutlinedButton.icon(
                                      onPressed: () => launchUrl(Uri.parse('https://wa.me/918657869659')),
                                      icon: const Icon(Icons.chat_rounded, size: 14),
                                      label: const Text('WHATSAPP', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w800, letterSpacing: 1)),
                                      style: OutlinedButton.styleFrom(
                                        foregroundColor: AppTheme.textPrimary,
                                        side: const BorderSide(color: AppTheme.borderLight),
                                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                                        padding: const EdgeInsets.symmetric(vertical: 12),
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),

                        // Dots
                        Positioned(
                          top: 20, right: 20,
                          child: Row(
                            children: List.generate(_carouselColors.length, (i) => Container(
                              margin: const EdgeInsets.only(left: 4),
                              width: i == _carouselIndex ? 16 : 4,
                              height: 4,
                              decoration: BoxDecoration(
                                color: i == _carouselIndex ? AppTheme.gold : AppTheme.gold.withOpacity(0.2),
                                borderRadius: BorderRadius.circular(2),
                              ),
                            )),
                          ),
                        ),
                      ],
                    ),
                  ),
                ).animate().fadeIn(duration: 500.ms).slideY(begin: 0.1),

                // ── STATS ─────────────────────────────────────
                _sectionLabel('Our Impact'),
                SizedBox(
                  height: 80,
                  child: ListView.separated(
                    scrollDirection: Axis.horizontal,
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    itemCount: _stats.length,
                    separatorBuilder: (_, __) => const SizedBox(width: 12),
                    itemBuilder: (_, i) {
                      final s = _stats[i];
                      return Container(
                        width: 110,
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(18),
                          border: Border.all(color: AppTheme.borderLight),
                        ),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(s['value']!,
                                style: const TextStyle(
                                  color: AppTheme.textPrimary,
                                  fontSize: 22,
                                  fontWeight: FontWeight.w900,
                                  letterSpacing: -1,
                                )),
                            const SizedBox(height: 2),
                            Text(s['label']!.toUpperCase(),
                                style: const TextStyle(
                                  color: AppTheme.gold,
                                  fontSize: 8,
                                  fontWeight: FontWeight.w800,
                                  letterSpacing: 1.5,
                                )),
                          ],
                        ),
                      );
                    },
                  ),
                ),

                // ── SERVICES ─────────────────────────────────
                _sectionLabel('Why Students Trust Us'),
                GridView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 3,
                    crossAxisSpacing: 12,
                    mainAxisSpacing: 12,
                    childAspectRatio: 0.9,
                  ),
                  itemCount: _services.length,
                  itemBuilder: (_, i) {
                    final s = _services[i];
                    return GestureDetector(
                      onTap: () => context.go('/services'),
                      child: Container(
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(18),
                          border: Border.all(color: AppTheme.borderLight),
                        ),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(s['icon']!, style: const TextStyle(fontSize: 26)),
                            const SizedBox(height: 8),
                            Padding(
                              padding: const EdgeInsets.symmetric(horizontal: 6),
                              child: Text(
                                s['title']!,
                                textAlign: TextAlign.center,
                                style: const TextStyle(
                                  color: AppTheme.textPrimary,
                                  fontSize: 10,
                                  fontWeight: FontWeight.w800,
                                  height: 1.3,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ).animate().fadeIn(delay: Duration(milliseconds: i * 60)).scale(begin: const Offset(0.9, 0.9));
                  },
                ),

                // ── TOP DESTINATIONS ─────────────────────────
                _sectionLabel('Top Destinations'),
                SizedBox(
                  height: 90,
                  child: ListView.separated(
                    scrollDirection: Axis.horizontal,
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    itemCount: _countries.length,
                    separatorBuilder: (_, __) => const SizedBox(width: 16),
                    itemBuilder: (_, i) {
                      final c = _countries[i];
                      return GestureDetector(
                        onTap: () => context.go('/universities/${c['name']}'),
                        child: Column(
                          children: [
                            Container(
                              width: 52, height: 52,
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                border: Border.all(color: AppTheme.gold, width: 2),
                                boxShadow: [
                                  BoxShadow(
                                    color: AppTheme.gold.withOpacity(0.2),
                                    blurRadius: 8,
                                    offset: const Offset(0, 3),
                                  ),
                                ],
                              ),
                              child: ClipOval(
                                child: CountryFlag.fromCountryCode(
                                  c['code']!,
                                  height: 52, width: 52,
                                ),
                              ),
                            ),
                            const SizedBox(height: 8),
                            Text(
                              c['name']!,
                              style: const TextStyle(
                                fontSize: 9,
                                fontWeight: FontWeight.w700,
                                letterSpacing: 1.2,
                                color: AppTheme.textSecondary,
                              ),
                            ),
                          ],
                        ),
                      );
                    },
                  ),
                ),

                // ── DREAMS / SCHOLARSHIPS ─────────────────────
                _sectionLabel('Scholarship Highlights'),
                Container(
                  margin: const EdgeInsets.symmetric(horizontal: 16),
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(24),
                    border: Border.all(color: AppTheme.borderLight),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: _dreams.map((d) => Column(
                      children: [
                        ClipRRect(
                          borderRadius: BorderRadius.circular(6),
                          child: CountryFlag.fromCountryCode(d['code']!, height: 28, width: 44),
                        ),
                        const SizedBox(height: 8),
                        Text(d['name']!,
                            style: const TextStyle(color: AppTheme.gold, fontSize: 9, fontWeight: FontWeight.w800, letterSpacing: 1)),
                        const SizedBox(height: 4),
                        Text(d['stat']!,
                            style: const TextStyle(color: AppTheme.textPrimary, fontSize: 16, fontWeight: FontWeight.w900)),
                        Text(d['sub']!,
                            style: TextStyle(color: AppTheme.textSecondary.withOpacity(0.6), fontSize: 8, fontWeight: FontWeight.w600)),
                      ],
                    )).toList(),
                  ),
                ),

                const SizedBox(height: 32),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _sectionLabel(String text) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 24, 16, 14),
      child: Text(
        text.toUpperCase(),
        style: const TextStyle(
          fontSize: 10,
          fontWeight: FontWeight.w900,
          letterSpacing: 2.5,
          color: AppTheme.textPrimary,
        ),
      ),
    );
  }
}

class _GoldPatternPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = AppTheme.gold.withOpacity(0.05)
      ..strokeWidth = 1
      ..style = PaintingStyle.stroke;
    for (double r = 50; r < size.width * 1.5; r += 60) {
      canvas.drawCircle(Offset(size.width, 0), r, paint);
    }
  }

  @override
  bool shouldRepaint(_) => false;
}
