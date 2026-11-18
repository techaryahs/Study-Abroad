import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:country_flags/country_flags.dart';
import '../../core/theme.dart';
import '../../widgets/edu_components.dart';

class CountriesScreen extends StatelessWidget {
  const CountriesScreen({super.key});

  final List<Map<String, dynamic>> _countries = const [
    {
      'name': 'USA',
      'slug': 'usa',
      'code': 'US',
      'universities': '4,500+',
      'description': 'Home to Ivy League & top-ranked research institutions',
      'scholarships': '₹2Cr Max',
      'visa': 'F1 Visa',
      'color': 0xFF1B3F8B,
    },
    {
      'name': 'UK',
      'slug': 'united-kingdom',
      'code': 'GB',
      'universities': '160+',
      'description': 'Russell Group & prestigious academic heritage',
      'scholarships': 'Merit Awards',
      'visa': 'Student Visa',
      'color': 0xFF912338,
    },
    {
      'name': 'Germany',
      'slug': 'germany',
      'code': 'DE',
      'universities': '400+',
      'description': 'High-value STEM programs and tuition-free public universities',
      'scholarships': 'Full Funding',
      'visa': 'Student Visa',
      'color': 0xFF1A1A1A,
    },
    {
      'name': 'Australia',
      'slug': 'australia',
      'code': 'AU',
      'universities': '43+',
      'description': 'Group of Eight & world-class practical learning',
      'scholarships': '50% Fee Waiver',
      'visa': 'Subclass 500',
      'color': 0xFF003087,
    },
    {
      'name': 'Canada',
      'slug': 'canada',
      'code': 'CA',
      'universities': '100+',
      'description': 'Scholarship-friendly, student-first education and pathways',
      'scholarships': 'Provincial Aid',
      'visa': 'Study Permit',
      'color': 0xFFFF0000,
    },
    {
      'name': 'Ireland',
      'slug': 'ireland',
      'code': 'IE',
      'universities': '30+',
      'description': 'Strong career outcomes, innovation hubs and tech headquarters',
      'scholarships': 'Government Grants',
      'visa': 'Study Visa',
      'color': 0xFF169B62,
    },
    {
      'name': 'Dubai',
      'slug': 'dubai',
      'code': 'AE',
      'universities': '70+',
      'description': 'Global education hub with international satellite campuses',
      'scholarships': 'Merit-Based',
      'visa': 'Student Visa',
      'color': 0xFF00732F,
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
      body: ListView(
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
                  label: 'Global Destinations',
                  icon: Icons.public_rounded,
                  backgroundColor: Color(0x332CA59D),
                  textColor: AppTheme.goldLight,
                  borderColor: Color(0x442CA59D),
                ),
                const SizedBox(height: 14),
                Text(
                  'Explore Top\nStudy Destinations',
                  style: GoogleFonts.playfairDisplay(
                    color: Colors.white,
                    fontSize: 28,
                    fontWeight: FontWeight.w800,
                    height: 1.15,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  '15+ Countries, 1,500+ Top Universities, Tailored Admissions Advisory.',
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
            tagline: 'Countries',
            title: 'Where Ambition Belongs',
            padding: EdgeInsets.zero,
          ),

          const SizedBox(height: 12),

          ...List.generate(_countries.length, (i) {
            final c = _countries[i];
            return GestureDetector(
              onTap: () => context.push('/universities/${c['slug']}'),
              child: Container(
                margin: const EdgeInsets.only(bottom: 16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: AppTheme.borderLight),
                  boxShadow: AppTheme.cardShadow,
                ),
                clipBehavior: Clip.antiAlias,
                child: Column(
                  children: [
                    // Country Header
                    Container(
                      padding: const EdgeInsets.all(20),
                      decoration: const BoxDecoration(
                        color: AppTheme.surfaceMuted,
                        border: Border(
                          bottom: BorderSide(color: AppTheme.borderLight),
                        ),
                      ),
                      child: Row(
                        children: [
                          Container(
                            width: 52,
                            height: 52,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              border: Border.all(color: AppTheme.borderLight),
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.black.withValues(alpha: 0.04),
                                  blurRadius: 6,
                                  offset: const Offset(0, 2),
                                ),
                              ],
                            ),
                            child: ClipOval(
                              child: CountryFlag.fromCountryCode(
                                c['code'] as String,
                                height: 52,
                                width: 52,
                              ),
                            ),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  c['name'] as String,
                                  style: GoogleFonts.inter(
                                    fontSize: 18,
                                    fontWeight: FontWeight.w900,
                                    color: AppTheme.navy,
                                  ),
                                ),
                                const SizedBox(height: 3),
                                Text(
                                  c['description'] as String,
                                  style: GoogleFonts.inter(
                                    fontSize: 12,
                                    color: AppTheme.textSecondary,
                                    height: 1.35,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(width: 8),
                          Container(
                            width: 34,
                            height: 34,
                            decoration: BoxDecoration(
                              color: AppTheme.teal.withValues(alpha: 0.12),
                              shape: BoxShape.circle,
                            ),
                            child: const Icon(
                              Icons.arrow_forward_rounded,
                              size: 16,
                              color: AppTheme.tealDark,
                            ),
                          ),
                        ],
                      ),
                    ),

                    // Stats row
                    Padding(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 14,
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceAround,
                        children: [
                          _statChip(Icons.account_balance_rounded, c['universities'] as String, 'Institutes'),
                          _divider(),
                          _statChip(Icons.monetization_on_rounded, c['scholarships'] as String, 'Scholarship'),
                          _divider(),
                          _statChip(Icons.flight_takeoff_rounded, c['visa'] as String, 'Visa Support'),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            )
                .animate()
                .fadeIn(delay: Duration(milliseconds: i * 60))
                .slideY(begin: 0.05);
          }),
        ],
      ),
    );
  }

  Widget _statChip(IconData icon, String value, String label) {
    return Column(
      children: [
        Icon(icon, size: 18, color: AppTheme.goldDark),
        const SizedBox(height: 4),
        Text(
          value,
          style: GoogleFonts.inter(
            fontSize: 13,
            fontWeight: FontWeight.w900,
            color: AppTheme.navy,
          ),
        ),
        Text(
          label.toUpperCase(),
          style: GoogleFonts.inter(
            fontSize: 9,
            color: AppTheme.textSecondary,
            fontWeight: FontWeight.w800,
            letterSpacing: 0.8,
          ),
        ),
      ],
    );
  }

  Widget _divider() {
    return Container(width: 1, height: 28, color: AppTheme.borderLight);
  }
}
