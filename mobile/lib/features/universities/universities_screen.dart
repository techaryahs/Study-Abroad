import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/theme.dart';
import '../../widgets/edu_components.dart';

class UniversitiesScreen extends StatelessWidget {
  const UniversitiesScreen({super.key});

  static final List<Map<String, dynamic>> _items = [
    {
      'title': 'Top Universities By Country',
      'subtitle':
          'Find statistics like acceptance rates, expenses, deadlines, and test scores.',
      'icon': Icons.public_rounded,
      'badge': null,
      'route': '/universities/countries',
    },
    {
      'title': 'UniPredict',
      'subtitle': 'Predicts where you can get admits based on your academic background.',
      'icon': Icons.bar_chart_rounded,
      'badge': null,
      'route': '/universities/unipredict',
    },
    {
      'title': 'RateMyChances',
      'subtitle': 'Estimates your admit chances based on your competitive profile.',
      'icon': Icons.percent_rounded,
      'badge': 'NEW',
      'route': '/universities/rate-my-chances',
    },
    {
      'title': 'Popular Programs',
      'subtitle': 'Explore the most sought-after academic programs and STEM degrees worldwide.',
      'icon': Icons.menu_book_rounded,
      'badge': null,
      'route': '/universities/popular-programs',
    },
    {
      'title': 'High Ranked Cheap Universities',
      'subtitle': 'Top-quality education without breaking the bank.',
      'icon': Icons.monetization_on_rounded,
      'badge': null,
      'route': '/universities/high-ranked-cheap',
    },
    {
      'title': 'Top Universities by State',
      'subtitle':
          'Filter top schools by regional hubs (California, Texas, Ontario, etc.).',
      'icon': Icons.location_on_rounded,
      'badge': null,
      'route': '/universities/by-state',
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        title: const EduBrandHeaderTitle(),
        backgroundColor: Colors.white,
        elevation: 0,
        surfaceTintColor: Colors.white,
      ),
      body: SafeArea(
        child: ListView(
          physics: const BouncingScrollPhysics(),
          padding: const EdgeInsets.all(16),
          children: [
            // ── Navy Feature Header ─────────────────────────
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: AppTheme.navy,
                borderRadius: BorderRadius.circular(32),
                border: Border.all(color: Colors.white.withValues(alpha: 0.12)),
                boxShadow: AppTheme.navyShadow,
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const EduPillBadge(
                    label: 'University Intelligence',
                    icon: Icons.school_rounded,
                    backgroundColor: Color(0x332CA59D),
                    textColor: AppTheme.goldLight,
                    borderColor: Color(0x442CA59D),
                  ),
                  const SizedBox(height: 14),
                  Text(
                    'Top Global\nUniversities & Tools',
                    style: GoogleFonts.playfairDisplay(
                      color: Colors.white,
                      fontSize: 28,
                      fontWeight: FontWeight.w800,
                      height: 1.15,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Explore acceptance rates, tuition, requirements, and AI predictor engines.',
                    style: GoogleFonts.inter(
                      color: Colors.white.withValues(alpha: 0.75),
                      fontSize: 13,
                      height: 1.4,
                    ),
                  ),
                ],
              ),
            ).animate().fadeIn(duration: 400.ms),

            const SizedBox(height: 24),

            const EduSectionHeader(
              tagline: 'Shortlist & Insights',
              title: 'Curated Pathways',
              padding: EdgeInsets.zero,
            ),

            const SizedBox(height: 12),

            ...List.generate(_items.length, (index) {
              final item = _items[index];

              return GestureDetector(
                onTap: () => context.push(item['route'] as String),
                child: Container(
                  margin: const EdgeInsets.only(bottom: 14),
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(24),
                    border: Border.all(color: AppTheme.borderLight),
                    boxShadow: AppTheme.cardShadow,
                  ),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(
                        width: 48,
                        height: 48,
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            colors: [
                              AppTheme.teal.withValues(alpha: 0.15),
                              AppTheme.gold.withValues(alpha: 0.15),
                            ],
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                          ),
                          borderRadius: BorderRadius.circular(16),
                        ),
                        child: Icon(
                          item['icon'] as IconData,
                          color: AppTheme.navy,
                          size: 24,
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Expanded(
                                  child: Text(
                                    item['title'] as String,
                                    style: GoogleFonts.inter(
                                      fontSize: 16,
                                      fontWeight: FontWeight.w900,
                                      color: AppTheme.navy,
                                    ),
                                  ),
                                ),
                                if (item['badge'] != null) ...[
                                  const SizedBox(width: 8),
                                  EduStatusChip(
                                    label: item['badge'] as String,
                                    color: AppTheme.goldDark,
                                  ),
                                ],
                              ],
                            ),
                            const SizedBox(height: 6),
                            Text(
                              item['subtitle'] as String,
                              style: GoogleFonts.inter(
                                fontSize: 12,
                                color: AppTheme.textSecondary,
                                height: 1.4,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 8),
                      Container(
                        width: 32,
                        height: 32,
                        decoration: const BoxDecoration(
                          color: AppTheme.surfaceMuted,
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(
                          Icons.arrow_forward_rounded,
                          size: 15,
                          color: AppTheme.tealDark,
                        ),
                      ),
                    ],
                  ),
                ),
              )
                  .animate()
                  .fadeIn(delay: Duration(milliseconds: index * 60))
                  .slideY(begin: 0.04);
            }),
          ],
        ),
      ),
    );
  }
}
