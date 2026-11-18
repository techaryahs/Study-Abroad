import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../core/theme.dart';
import '../../widgets/book_counselling_sheet.dart';
import '../../widgets/edu_components.dart';
import '../../widgets/navigation_overlay.dart';
import '../auth/auth_provider.dart';

class LandingScreen extends StatelessWidget {
  const LandingScreen({super.key});

  static const _services = [
    (Icons.account_balance_rounded, 'Admission Guidance', '/services/application_help'),
    (Icons.school_rounded, 'University Shortlisting', '/services/university_finalization'),
    (Icons.edit_note_rounded, 'SOP & LOR Support', '/services/lor_drafting'),
    (Icons.monetization_on_rounded, 'Scholarship Assistance', '/resources/scholarships'),
    (Icons.flight_takeoff_rounded, 'Visa Guidance', '/services/visa_guidance'),
    (Icons.trending_up_rounded, 'Profile Building', '/services/resume_drafting'),
  ];

  static const _stats = [
    ('1,500+', 'Top Universities'),
    ('500+', 'Elite Scholarships'),
    ('15+', 'Global Destinations'),
    ('10,000+', 'Premium Programs'),
  ];

  static const _destinations = [
    ('USA', 'US', 'usa'),
    ('UK', 'GB', 'united-kingdom'),
    ('Germany', 'DE', 'germany'),
    ('Australia', 'AU', 'australia'),
    ('Canada', 'CA', 'canada'),
    ('Ireland', 'IE', 'ireland'),
  ];

  void _openBooking(BuildContext context) {
    final auth = context.read<AuthProvider>();
    if (auth.isLoggedIn) {
      showBookCounsellingSheet(context);
      return;
    }
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Create an account to book your consultation.')),
    );
    context.push('/register');
  }

  Future<void> _openWhatsApp(BuildContext context) async {
    final uri = Uri.parse('https://wa.me/918657869659');
    try {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    } catch (_) {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Could not open WhatsApp')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      endDrawer: const NavigationOverlay(),
      appBar: PreferredSize(
        preferredSize: const Size.fromHeight(80),
        child: Container(
          color: Colors.white,
          padding: const EdgeInsets.symmetric(horizontal: 16),
          alignment: Alignment.bottomCenter,
          child: SafeArea(
            bottom: false,
            child: SizedBox(
              height: 70,
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const EduBrandHeaderTitle(),
                  Builder(
                    builder: (context) => IconButton(
                      icon: const Icon(
                        Icons.menu_rounded,
                        color: AppTheme.navy,
                        size: 28,
                      ),
                      onPressed: () => Scaffold.of(context).openEndDrawer(),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
      body: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // ── Hero Section ──────────────────────────────
            Container(
              margin: const EdgeInsets.all(16),
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(32),
                border: Border.all(color: AppTheme.borderLight),
                boxShadow: AppTheme.cardShadow,
              ),
              child: Column(
                children: [
                  const EduPillBadge(
                    label: 'Study Abroad, Reimagined',
                    icon: Icons.auto_awesome,
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'The World Is\nYour Campus.',
                    textAlign: TextAlign.center,
                    style: GoogleFonts.playfairDisplay(
                      color: AppTheme.goldAccent,
                      fontSize: 34,
                      height: 1.05,
                      fontWeight: FontWeight.w900,
                      letterSpacing: -0.5,
                    ),
                  ),
                  const SizedBox(height: 14),
                  Text(
                    'Empowering students to learn, grow, and thrive on a global stage.',
                    textAlign: TextAlign.center,
                    style: GoogleFonts.inter(
                      color: AppTheme.textSecondary,
                      fontSize: 15,
                      height: 1.5,
                    ),
                  ),
                  const SizedBox(height: 24),
                  Row(
                    children: [
                      Expanded(
                        child: EduGoldButton(
                          label: 'Talk to an Expert',
                          onPressed: () => _openBooking(context),
                        ),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: EduOutlinedButton(
                          label: 'WhatsApp Us',
                          icon: const Icon(
                            Icons.chat_bubble_outline_rounded,
                            size: 16,
                            color: AppTheme.navy,
                          ),
                          onPressed: () => _openWhatsApp(context),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            // ── Stats Section (Navy) ──────────────────────
            Container(
              margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: AppTheme.navy,
                borderRadius: BorderRadius.circular(32),
                border: Border.all(color: Colors.white.withValues(alpha: 0.1)),
                boxShadow: AppTheme.navyShadow,
              ),
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
                      fontSize: 22,
                      fontWeight: FontWeight.w800,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 18),
                  GridView.builder(
                    padding: EdgeInsets.zero,
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 2,
                      crossAxisSpacing: 12,
                      mainAxisSpacing: 12,
                      childAspectRatio: 1.35,
                    ),
                    itemCount: _stats.length,
                    itemBuilder: (context, index) {
                      final stat = _stats[index];
                      return EduStatCard(
                        value: stat.$1,
                        label: stat.$2,
                        isDark: true,
                      );
                    },
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // ── Services Section ──────────────────────────
            EduSectionHeader(
              tagline: 'Our Expertise',
              title: 'Guidance built around your goals',
              actionLabel: 'All Services',
              onAction: () => context.push('/services'),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: GridView.builder(
                padding: EdgeInsets.zero,
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  crossAxisSpacing: 12,
                  mainAxisSpacing: 12,
                  childAspectRatio: 0.80,
                ),
                itemCount: _services.length,
                itemBuilder: (context, index) {
                  final s = _services[index];
                  return EduServiceCard(
                    title: s.$2,
                    description: 'Structured advisory for global admissions.',
                    iconData: s.$1,
                    onTap: () => context.push(s.$3),
                  );
                },
              ),
            ),

            const SizedBox(height: 32),

            // ── Destinations Section ──────────────────────
            EduSectionHeader(
              tagline: 'Popular Destinations',
              title: 'Study where ambition belongs',
              actionLabel: 'Explore All',
              onAction: () => context.push('/universities'),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: ListView.separated(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: _destinations.length,
                separatorBuilder: (_, __) => const SizedBox(height: 10),
                itemBuilder: (context, index) {
                  final dest = _destinations[index];
                  return EduDestinationCard(
                    name: dest.$1,
                    countryCode: dest.$2,
                    description: 'Ivy League pathways & elite global campuses',
                    onTap: () => context.push('/universities/${dest.$3}'),
                  );
                },
              ),
            ),

            const SizedBox(height: 36),

            // ── Testimonial ───────────────────────────────
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Container(
                padding: const EdgeInsets.all(28),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(28),
                  border: Border.all(color: AppTheme.borderLight),
                  boxShadow: AppTheme.cardShadow,
                ),
                child: Column(
                  children: [
                    const Icon(
                      Icons.format_quote_rounded,
                      size: 36,
                      color: AppTheme.gold,
                    ),
                    const SizedBox(height: 12),
                    Text(
                      '"The personalized attention and strategic profile building sessions were instrumental in my acceptance to Columbia."',
                      textAlign: TextAlign.center,
                      style: GoogleFonts.playfairDisplay(
                        fontSize: 18,
                        fontStyle: FontStyle.italic,
                        fontWeight: FontWeight.w600,
                        color: AppTheme.navy,
                        height: 1.45,
                      ),
                    ),
                    const SizedBox(height: 16),
                    Container(width: 40, height: 2, color: AppTheme.gold),
                    const SizedBox(height: 12),
                    Text(
                      'COLUMBIA UNIVERSITY ADMIT',
                      style: GoogleFonts.inter(
                        fontSize: 10,
                        fontWeight: FontWeight.w800,
                        color: AppTheme.tealDark,
                        letterSpacing: 2.0,
                      ),
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 36),

            // ── Bottom CTA ────────────────────────────────
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Container(
                padding: const EdgeInsets.all(28),
                decoration: BoxDecoration(
                  color: AppTheme.navyDark,
                  borderRadius: BorderRadius.circular(32),
                  boxShadow: AppTheme.navyShadow,
                ),
                child: Column(
                  children: [
                    Text(
                      'Ready to Start Your Journey?',
                      textAlign: TextAlign.center,
                      style: GoogleFonts.playfairDisplay(
                        fontSize: 24,
                        fontWeight: FontWeight.w800,
                        color: AppTheme.gold,
                      ),
                    ),
                    const SizedBox(height: 10),
                    Text(
                      'The first step to your global future begins with a single conversation.',
                      textAlign: TextAlign.center,
                      style: GoogleFonts.inter(
                        fontSize: 13,
                        color: Colors.white.withValues(alpha: 0.8),
                        height: 1.4,
                      ),
                    ),
                    const SizedBox(height: 24),
                    SizedBox(
                      width: double.infinity,
                      child: EduGoldButton(
                        label: 'Book Free Consultation',
                        onPressed: () => _openBooking(context),
                      ),
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 48),

            // ── Footer ────────────────────────────────────
            Container(
              padding: const EdgeInsets.symmetric(vertical: 40, horizontal: 20),
              color: Colors.white,
              child: Column(
                children: [
                  const EduBrandLogo(size: 48, showText: true),
                  const SizedBox(height: 24),
                  Wrap(
                    spacing: 20,
                    runSpacing: 12,
                    alignment: WrapAlignment.center,
                    children: [
                      _buildFooterLink(context, 'Admissions', '/universities'),
                      _buildFooterLink(context, 'Our Services', '/services'),
                      _buildFooterLink(context, 'Privacy Policy', '/privacy-policy'),
                      _buildFooterLink(context, 'Terms & Conditions', '/terms-condition'),
                    ],
                  ),
                  const SizedBox(height: 24),
                  Container(width: 48, height: 1, color: AppTheme.borderLight),
                  const SizedBox(height: 20),
                  Text(
                    '© 2026 EduLeaderGlobal',
                    style: GoogleFonts.inter(
                      fontSize: 12,
                      fontWeight: FontWeight.w700,
                      color: AppTheme.textSecondary,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFooterLink(BuildContext context, String title, String route) {
    return GestureDetector(
      onTap: () => context.push(route),
      child: Text(
        title,
        style: GoogleFonts.inter(
          fontSize: 13,
          fontWeight: FontWeight.w600,
          color: AppTheme.navy,
          decoration: TextDecoration.underline,
        ),
      ),
    );
  }
}
