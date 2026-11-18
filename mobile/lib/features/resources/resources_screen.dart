import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme.dart';
import '../../widgets/edu_components.dart';

class ResourcesScreen extends StatelessWidget {
  const ResourcesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        title: const EduBrandHeaderTitle(),
        backgroundColor: Colors.white,
        elevation: 0,
        surfaceTintColor: Colors.white,
        actions: [
          IconButton(
            onPressed: () => context.push('/resources/scholarships'),
            icon: const Icon(Icons.search_rounded, size: 24, color: AppTheme.navy),
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // ── Navy Header Card ──────────────────────────
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
                    label: 'Academic Vault',
                    icon: Icons.menu_book_rounded,
                    backgroundColor: Color(0x332CA59D),
                    textColor: AppTheme.goldLight,
                    borderColor: Color(0x442CA59D),
                  ),
                  const SizedBox(height: 14),
                  Text(
                    'Student Success\n& Resource Hub',
                    style: GoogleFonts.playfairDisplay(
                      color: Colors.white,
                      fontSize: 28,
                      fontWeight: FontWeight.w800,
                      height: 1.15,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Access scholarship indexes, research groups, loan support, and real student reviews.',
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
              tagline: 'Library',
              title: 'Featured Toolkits',
              padding: EdgeInsets.zero,
            ),

            const SizedBox(height: 12),

            Container(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: AppTheme.borderLight),
                boxShadow: AppTheme.cardShadow,
              ),
              clipBehavior: Clip.antiAlias,
              child: Column(
                children: [
                  _buildResourceItem(
                    context: context,
                    icon: Icons.groups_outlined,
                    title: 'Research Groups',
                    subtitle: 'Find and connect with academic research communities.',
                    routeName: 'research_groups',
                  ),
                  const Divider(color: AppTheme.borderLight, height: 1),
                  _buildResourceItem(
                    context: context,
                    icon: Icons.work_outline_rounded,
                    title: 'EB-1A Toolkit',
                    subtitle: 'Everything you need to build an extraordinary ability case.',
                    isNew: true,
                    routeName: 'eb1a',
                  ),
                  const Divider(color: AppTheme.borderLight, height: 1),
                  _buildResourceItem(
                    context: context,
                    icon: Icons.school_outlined,
                    title: 'Scholarships Database',
                    subtitle: 'Curated database of scholarships for international students.',
                    routeName: 'scholarships',
                  ),
                  const Divider(color: AppTheme.borderLight, height: 1),
                  _buildResourceItem(
                    context: context,
                    icon: Icons.attach_money_outlined,
                    title: 'Education Loan Support',
                    subtitle: 'Guidance on financing your international education.',
                    routeName: 'education_loan',
                  ),
                  const Divider(color: AppTheme.borderLight, height: 1),
                  _buildResourceItem(
                    context: context,
                    icon: Icons.star_outline_rounded,
                    title: 'Student Reviews',
                    subtitle: 'Read authentic student reviews of universities and programs.',
                    routeName: 'reviews',
                  ),
                ],
              ),
            ).animate().fadeIn(duration: 500.ms).slideY(begin: 0.05),

            const SizedBox(height: 36),
          ],
        ),
      ),
    );
  }

  Widget _buildResourceItem({
    required BuildContext context,
    required IconData icon,
    required String title,
    required String subtitle,
    required String routeName,
    bool isNew = false,
  }) {
    return InkWell(
      onTap: () {
        if (routeName == 'research_groups') {
          context.push('/resources/research-groups');
        } else if (routeName == 'eb1a') {
          context.push('/resources/eb1a');
        } else if (routeName == 'education_loan') {
          context.push('/resources/education-loan');
        } else if (routeName == 'scholarships') {
          context.push('/resources/scholarships');
        } else if (routeName == 'reviews') {
          context.push('/resources/reviews');
        } else {
          context.push('/resources');
        }
      },
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 18),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(12),
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
              child: Icon(icon, color: AppTheme.navy, size: 22),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Text(
                        title,
                        style: GoogleFonts.inter(
                          fontSize: 16,
                          fontWeight: FontWeight.w900,
                          color: AppTheme.navy,
                        ),
                      ),
                      if (isNew) ...[
                        const SizedBox(width: 8),
                        const EduStatusChip(
                          label: 'NEW',
                          color: Colors.redAccent,
                        ),
                      ],
                    ],
                  ),
                  const SizedBox(height: 4),
                  Text(
                    subtitle,
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
    );
  }
}
