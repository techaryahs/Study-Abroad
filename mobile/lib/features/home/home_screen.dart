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
  final List<Map<String, String>> _services = [
    {'title': 'Admission Guidance', 'icon': '🏛️', 'route': '/services/application-help'},
    {'title': 'University Shortlisting', 'icon': '📋', 'route': '/services/shortlisting'},
    {'title': 'SOP & LOR Support', 'icon': '✍️', 'route': '/services/sop'},
    {'title': 'Scholarship Assistance', 'icon': '🎓', 'route': '/services/scholarship'},
    {'title': 'Visa Guidance', 'icon': '🛂', 'route': '/services/visa-application-help'},
    {'title': 'Profile Building', 'icon': '📈', 'route': '/services/profile-building'},
  ];

  final List<Map<String, String>> _countries = [
    {'name': 'USA', 'slug': 'usa', 'code': 'US'},
    {'name': 'UK', 'slug': 'united-kingdom', 'code': 'GB'},
    {'name': 'Germany', 'slug': 'germany', 'code': 'DE'},
    {'name': 'Australia', 'slug': 'australia', 'code': 'AU'},
    {'name': 'Ireland', 'slug': 'ireland', 'code': 'IE'},
    {'name': 'Dubai', 'slug': 'dubai', 'code': 'AE'},
    {'name': 'Canada', 'slug': 'canada', 'code': 'CA'},
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

                // ── HERO CARD (Photo + Scholarship Strip) ──────
                Padding(
                  padding: const EdgeInsets.fromLTRB(16, 16, 16, 0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      // ── Photo card ────────────────────────────
                      Container(
                        padding: const EdgeInsets.all(24),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(32),
                          border: Border.all(color: AppTheme.gold.withOpacity(0.4)),
                          boxShadow: [
                            BoxShadow(
                              color: AppTheme.gold.withOpacity(0.25),
                              blurRadius: 40,
                              offset: const Offset(0, 12),
                            ),
                          ],
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Education Leader\nLed Path to\nIvy League &\nTop Global Universities',
                              style: TextStyle(
                                color: AppTheme.darkBrown,
                                fontSize: 24,
                                fontWeight: FontWeight.w900,
                                height: 1.15,
                                letterSpacing: -0.5,
                              ),
                            ),
                            const SizedBox(height: 16),
                            Row(
                              children: [
                                Expanded(
                                  child: ElevatedButton(
                                    onPressed: () => showBookCounsellingSheet(context),
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: AppTheme.gold,
                                      foregroundColor: AppTheme.darkBrown,
                                      shape: RoundedRectangleBorder(
                                          borderRadius: BorderRadius.circular(12)),
                                      padding: const EdgeInsets.symmetric(vertical: 12),
                                    ),
                                    child: const Text('TALK TO EXPERT',
                                        style: TextStyle(
                                            fontSize: 10,
                                            fontWeight: FontWeight.w800,
                                            letterSpacing: 1)),
                                  ),
                                ),
                                const SizedBox(width: 10),
                                Expanded(
                                  child: OutlinedButton.icon(
                                    onPressed: () => launchUrl(Uri.parse('https://wa.me/918657869659')),
                                    icon: const Icon(Icons.chat_rounded, size: 13, color: AppTheme.darkBrown),
                                    label: const Text('WHATSAPP',
                                        style: TextStyle(
                                            fontSize: 10,
                                            fontWeight: FontWeight.w800,
                                            letterSpacing: 1,
                                            color: AppTheme.darkBrown)),
                                    style: OutlinedButton.styleFrom(
                                      side: BorderSide(color: AppTheme.darkBrown.withOpacity(0.35)),
                                      shape: RoundedRectangleBorder(
                                          borderRadius: BorderRadius.circular(12)),
                                      padding: const EdgeInsets.symmetric(vertical: 12),
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),

                      // ── Scholarship strip ──────────────────────
                      const SizedBox(height: 12),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
                        decoration: BoxDecoration(
                          color: const Color(0xFF40332D),
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: AppTheme.gold.withOpacity(0.2)),
                          boxShadow: [
                            BoxShadow(
                              color: AppTheme.gold.withOpacity(0.1),
                              blurRadius: 20,
                              offset: const Offset(0, 6),
                            ),
                          ],
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceAround,
                          children: _dreams.map((d) => Column(
                            children: [
                              ClipRRect(
                                borderRadius: BorderRadius.circular(3),
                                child: CountryFlag.fromCountryCode(d['code']!, height: 20, width: 30),
                              ),
                              const SizedBox(height: 6),
                              Text(d['name']!,
                                  style: const TextStyle(
                                      color: AppTheme.gold, fontSize: 8, fontWeight: FontWeight.w800, letterSpacing: 1)),
                              const SizedBox(height: 2),
                              Text(d['stat']!,
                                  style: const TextStyle(
                                      color: Color(0xFFF8F6F1), fontSize: 14, fontWeight: FontWeight.w900)),
                              Text(d['sub']!,
                                  style: TextStyle(
                                      color: const Color(0xFFF8F6F1).withOpacity(0.5),
                                      fontSize: 7,
                                      fontWeight: FontWeight.w700,
                                      letterSpacing: 0.8)),
                            ],
                          )).toList(),
                        ),
                      ),
                    ],
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
                      onTap: () {
                        if (s['route'] == 'sheet') {
                          showBookCounsellingSheet(context);
                        } else {
                          context.go(s['route']!);
                        }
                      },
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
                        onTap: () => context.go('/universities/${c['slug']}'),
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
