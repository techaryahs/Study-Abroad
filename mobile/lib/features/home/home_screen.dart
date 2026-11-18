import 'dart:io' show Platform;
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:provider/provider.dart';
import '../../core/theme.dart';
import '../../widgets/book_counselling_sheet.dart';
import '../../widgets/edu_components.dart';
import '../cart/cart_provider.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final List<Map<String, dynamic>> _destinations = const [
    {
      'name': 'USA',
      'code': 'US',
      'slug': 'usa',
      'description': 'Ivy League pathways & elite campuses',
    },
    {
      'name': 'UK',
      'code': 'GB',
      'slug': 'united-kingdom',
      'description': 'Prestige, research, and global alumni',
    },
    {
      'name': 'Germany',
      'code': 'DE',
      'slug': 'germany',
      'description': 'High-value STEM and innovation programs',
    },
    {
      'name': 'Australia',
      'code': 'AU',
      'slug': 'australia',
      'description': 'Practical learning with global industry reach',
    },
    {
      'name': 'Canada',
      'code': 'CA',
      'slug': 'canada',
      'description': 'Scholarship-friendly, student-first education',
    },
    {
      'name': 'Ireland',
      'code': 'IE',
      'slug': 'ireland',
      'description': 'Strong career outcomes and innovation hubs',
    },
  ];

  final List<Map<String, dynamic>> _services = const [
    {
      'title': 'Admission Guidance',
      'description': 'Comprehensive strategy for university applications.',
      'icon': Icons.account_balance_rounded,
      'route': '/services/application_help',
    },
    {
      'title': 'University Shortlisting',
      'description': 'Data-driven curation of dream, reach & safe universities.',
      'icon': Icons.school_rounded,
      'route': '/services/university_finalization',
    },
    {
      'title': 'SOP & LOR Support',
      'description': 'Craft compelling statements and mentor recommendation letters.',
      'icon': Icons.edit_note_rounded,
      'route': '/services/lor_drafting',
    },
    {
      'title': 'Scholarship Assistance',
      'description': 'Explore funding, grants, and high-value merit awards.',
      'icon': Icons.monetization_on_rounded,
      'route': '/resources/scholarships',
    },
    {
      'title': 'Visa Guidance',
      'description': 'F-1 mock interviews, documentation & compliance assistance.',
      'icon': Icons.flight_takeoff_rounded,
      'route': '/services/visa_guidance',
    },
    {
      'title': 'Profile Building',
      'description': 'Resume drafting, extracurriculars & portfolio enhancements.',
      'icon': Icons.trending_up_rounded,
      'route': '/services/resume_drafting',
    },
  ];

  final List<Map<String, String>> _statsRow = const [
    {'value': '1,500+', 'label': 'Top Universities'},
    {'value': '500+', 'label': 'Elite Scholarships'},
    {'value': '15+', 'label': 'Global Destinations'},
    {'value': '10,000+', 'label': 'Premium Programs'},
  ];

  final List<Map<String, String>> _partnerMarks = const [
    {
      'name': 'AdmitPilot',
      'tag': 'Predict your shortlist',
      'route': '/universities/unipredict',
    },
    {
      'name': 'VisaFlow',
      'tag': 'Clear, guided support',
      'route': '/services/visa_guidance',
    },
    {
      'name': 'ScholarshipIQ',
      'tag': 'Smarter funding insight',
      'route': '/resources/scholarships',
    },
    {
      'name': 'CampusCompass',
      'tag': 'Destination-first planning',
      'route': '/countries',
    },
  ];

  Future<void> _launchWhatsApp() async {
    const phone = '918657869659';
    final uri = Uri.parse('https://wa.me/$phone');
    try {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    } catch (_) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Could not open WhatsApp')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final cart = context.watch<CartProvider>();
    final isIOS = !kIsWeb && Platform.isIOS;

    return Scaffold(
      backgroundColor: AppTheme.background,
      body: CustomScrollView(
        physics: const BouncingScrollPhysics(),
        slivers: [
          // ── APP BAR ──────────────────────────────────────────
          SliverAppBar(
            pinned: true,
            floating: false,
            toolbarHeight: 70,
            backgroundColor: Colors.white,
            surfaceTintColor: Colors.white,
            elevation: 0,
            title: const EduBrandHeaderTitle(),
            actions: [
              if (!isIOS)
                Padding(
                  padding: const EdgeInsets.only(right: 12),
                  child: Stack(
                    alignment: Alignment.center,
                    children: [
                      IconButton(
                        icon: const Icon(
                          Icons.shopping_cart_outlined,
                          color: AppTheme.navy,
                          size: 24,
                        ),
                        onPressed: () => context.push('/cart'),
                      ),
                      if (cart.totalQuantity > 0)
                        Positioned(
                          top: 8,
                          right: 8,
                          child: Container(
                            constraints: const BoxConstraints(
                              minWidth: 18,
                              minHeight: 18,
                            ),
                            padding: const EdgeInsets.symmetric(horizontal: 4),
                            decoration: BoxDecoration(
                              color: AppTheme.gold,
                              borderRadius: BorderRadius.circular(99),
                              boxShadow: AppTheme.goldGlow,
                            ),
                            child: Center(
                              child: Text(
                                '${cart.totalQuantity}',
                                style: GoogleFonts.inter(
                                  fontSize: 10,
                                  fontWeight: FontWeight.w900,
                                  color: AppTheme.navy,
                                ),
                              ),
                            ),
                          ),
                        ),
                    ],
                  ),
                ),
            ],
            bottom: PreferredSize(
              preferredSize: const Size.fromHeight(1),
              child: Container(
                color: AppTheme.borderLight,
                height: 1,
              ),
            ),
          ),

          // ── HERO & MAIN CONTENT ─────────────────────────────
          SliverToBoxAdapter(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // ── Hero Section ─────────────────────────────
                _buildHeroSection(context),

                const SizedBox(height: 16),

                // ── Next Step Feature Card (Navy) ─────────────
                _buildNextStepCard(context),

                const SizedBox(height: 32),

                // ── Popular Destinations ──────────────────────
                EduSectionHeader(
                  tagline: 'Popular destinations',
                  title: 'Study where ambition belongs',
                  actionLabel: 'Explore all',
                  onAction: () => context.push('/universities'),
                ),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: ListView.separated(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: _destinations.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 12),
                    itemBuilder: (context, index) {
                      final dest = _destinations[index];
                      return EduDestinationCard(
                        name: dest['name'] as String,
                        countryCode: dest['code'] as String,
                        description: dest['description'] as String,
                        onTap: () => context.push('/universities/${dest['slug']}'),
                      ).animate().fadeIn(delay: Duration(milliseconds: 60 * index)).slideX(begin: 0.05);
                    },
                  ),
                ),

                const SizedBox(height: 36),

                // ── Education Services ────────────────────────
                EduSectionHeader(
                  tagline: 'Education services',
                  title: 'Guidance built around your goals',
                  actionLabel: 'All services',
                  onAction: () => context.push('/services'),
                ),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: GridView.builder(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 2,
                      crossAxisSpacing: 14,
                      mainAxisSpacing: 14,
                      childAspectRatio: 0.80,
                    ),
                    itemCount: _services.length,
                    itemBuilder: (context, index) {
                      final service = _services[index];
                      return EduServiceCard(
                        title: service['title'] as String,
                        description: service['description'] as String,
                        iconData: service['icon'] as IconData,
                        onTap: () => context.push(service['route'] as String),
                      ).animate().fadeIn(delay: Duration(milliseconds: 50 * index)).scale(begin: const Offset(0.95, 0.95));
                    },
                  ),
                ),

                const SizedBox(height: 36),

                // ── Meaningful Marks Section ──────────────────
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: Container(
                    padding: const EdgeInsets.all(24),
                    decoration: BoxDecoration(
                      color: AppTheme.surfaceMuted,
                      borderRadius: BorderRadius.circular(32),
                      border: Border.all(color: AppTheme.borderLight),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.all(8),
                              decoration: BoxDecoration(
                                color: AppTheme.teal.withValues(alpha: 0.12),
                                borderRadius: BorderRadius.circular(14),
                              ),
                              child: const Icon(
                                Icons.explore_rounded,
                                color: AppTheme.tealDark,
                                size: 20,
                              ),
                            ),
                            const SizedBox(width: 12),
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'MEANINGFUL MARKS',
                                  style: GoogleFonts.inter(
                                    fontSize: 10,
                                    fontWeight: FontWeight.w900,
                                    letterSpacing: 2.0,
                                    color: AppTheme.tealDark,
                                  ),
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  'Built for a global journey',
                                  style: GoogleFonts.playfairDisplay(
                                    fontSize: 18,
                                    fontWeight: FontWeight.w800,
                                    color: AppTheme.navy,
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                        const SizedBox(height: 20),
                        GridView.builder(
                          shrinkWrap: true,
                          physics: const NeverScrollableScrollPhysics(),
                          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                            crossAxisCount: 2,
                            crossAxisSpacing: 12,
                            mainAxisSpacing: 12,
                            childAspectRatio: 1.05,
                          ),
                          itemCount: _partnerMarks.length,
                          itemBuilder: (context, index) {
                            final mark = _partnerMarks[index];
                            final initials = mark['name']!.substring(0, 2).toUpperCase();
                            return GestureDetector(
                              onTap: () => context.push(mark['route']!),
                              child: Container(
                                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
                                decoration: BoxDecoration(
                                  color: Colors.white,
                                  borderRadius: BorderRadius.circular(20),
                                  border: Border.all(color: AppTheme.borderLight),
                                ),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Container(
                                      width: 32,
                                      height: 32,
                                      decoration: BoxDecoration(
                                        color: AppTheme.navy,
                                        borderRadius: BorderRadius.circular(10),
                                      ),
                                      alignment: Alignment.center,
                                      child: Text(
                                        initials,
                                        style: GoogleFonts.inter(
                                          fontSize: 12,
                                          fontWeight: FontWeight.w900,
                                          color: AppTheme.gold,
                                        ),
                                      ),
                                    ),
                                    const SizedBox(height: 10),
                                    Text(
                                      mark['name']!,
                                      style: GoogleFonts.inter(
                                        fontSize: 13,
                                        fontWeight: FontWeight.w900,
                                        color: AppTheme.navy,
                                      ),
                                    ),
                                    const SizedBox(height: 2),
                                    Text(
                                      mark['tag']!,
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                      style: GoogleFonts.inter(
                                        fontSize: 11,
                                        color: AppTheme.textSecondary,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            );
                          },
                        ),
                      ],
                    ),
                  ),
                ),

                const SizedBox(height: 48),
              ],
            ),
          ),
        ],
      ),
    );
  }

  /// ── Hero Section (The World Is Your Campus) ─────────────────────────
  Widget _buildHeroSection(BuildContext context) {
    return Container(
      margin: const EdgeInsets.fromLTRB(16, 16, 16, 0),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(32),
        border: Border.all(color: AppTheme.borderLight),
        boxShadow: AppTheme.cardShadow,
      ),
      clipBehavior: Clip.antiAlias,
      child: Stack(
        children: [
          // Background Campus Image Layer
          Positioned.fill(
            child: Opacity(
              opacity: 0.16,
              child: Image.asset(
                'assets/images/global-campus-hero.png',
                fit: BoxFit.cover,
                errorBuilder: (_, __, ___) => const SizedBox.shrink(),
              ),
            ),
          ),

          // Gradient overlay
          Positioned.fill(
            child: Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    Colors.white.withValues(alpha: 0.95),
                    Colors.white.withValues(alpha: 0.75),
                  ],
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                ),
              ),
            ),
          ),

          // Content
          Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Top Tag Pill
                const EduPillBadge(
                  label: 'Study Abroad, Reimagined',
                  icon: Icons.auto_awesome,
                ).animate().fadeIn(duration: 400.ms),

                const SizedBox(height: 16),

                // Large Serif Headline
                Text(
                  'The World Is\nYour Campus.',
                  style: GoogleFonts.playfairDisplay(
                    fontSize: 34,
                    fontWeight: FontWeight.w900,
                    color: AppTheme.goldAccent,
                    height: 1.05,
                    letterSpacing: -0.5,
                  ),
                ).animate().fadeIn(delay: 100.ms).slideY(begin: 0.1),

                const SizedBox(height: 12),

                // Subtitle
                Text(
                  'Empowering students to learn, grow, and thrive on a global stage.',
                  style: GoogleFonts.inter(
                    fontSize: 15,
                    color: AppTheme.textSecondary,
                    height: 1.45,
                  ),
                ).animate().fadeIn(delay: 200.ms),

                const SizedBox(height: 24),

                // CTAs (Talk to Expert + WhatsApp)
                Row(
                  children: [
                    Expanded(
                      child: EduGoldButton(
                        label: 'Talk to an Expert',
                        height: 48,
                        onPressed: () => showBookCounsellingSheet(context),
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: EduOutlinedButton(
                        label: 'WhatsApp Us',
                        height: 48,
                        icon: const Icon(
                          Icons.chat_bubble_outline_rounded,
                          size: 16,
                          color: AppTheme.navy,
                        ),
                        onPressed: _launchWhatsApp,
                      ),
                    ),
                  ],
                ).animate().fadeIn(delay: 300.ms),

                const SizedBox(height: 20),

                // Feature check pills
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: [
                    _buildFeatureChip('Personalized mentorship'),
                    _buildFeatureChip('Scholarship strategy'),
                    _buildFeatureChip('Visa-ready planning'),
                  ],
                ).animate().fadeIn(delay: 400.ms),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFeatureChip(String label) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
      decoration: BoxDecoration(
        color: AppTheme.surfaceMuted,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppTheme.borderLight),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(
            Icons.check_circle_rounded,
            size: 14,
            color: AppTheme.teal,
          ),
          const SizedBox(width: 6),
          Text(
            label,
            style: GoogleFonts.inter(
              fontSize: 11,
              fontWeight: FontWeight.w700,
              color: AppTheme.textSecondary,
            ),
          ),
        ],
      ),
    );
  }

  /// ── Next Step Card (Deep Navy Feature Card) ─────────────────────────
  Widget _buildNextStepCard(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      padding: const EdgeInsets.all(22),
      decoration: BoxDecoration(
        color: AppTheme.navy,
        borderRadius: BorderRadius.circular(32),
        border: Border.all(
          color: Colors.white.withValues(alpha: 0.12),
        ),
        boxShadow: AppTheme.navyShadow,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'YOUR NEXT STEP',
                      style: GoogleFonts.inter(
                        fontSize: 10,
                        fontWeight: FontWeight.w900,
                        letterSpacing: 2.5,
                        color: AppTheme.gold,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'From profile to placement.',
                      style: GoogleFonts.playfairDisplay(
                        fontSize: 20,
                        fontWeight: FontWeight.w800,
                        color: Colors.white,
                      ),
                    ),
                  ],
                ),
              ),
              Container(
                width: 44,
                height: 44,
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(
                    color: Colors.white.withValues(alpha: 0.15),
                  ),
                ),
                child: const Icon(
                  Icons.psychology_rounded,
                  color: AppTheme.gold,
                  size: 24,
                ),
              ),
            ],
          ),
          const SizedBox(height: 18),
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              crossAxisSpacing: 12,
              mainAxisSpacing: 12,
              childAspectRatio: 1.35,
            ),
            itemCount: _statsRow.length,
            itemBuilder: (context, index) {
              final s = _statsRow[index];
              return EduStatCard(
                value: s['value']!,
                label: s['label']!,
                isDark: true,
              );
            },
          ),
        ],
      ),
    ).animate().fadeIn(duration: 500.ms).slideY(begin: 0.08);
  }
}
