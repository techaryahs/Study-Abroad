import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../core/theme.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:go_router/go_router.dart';

class ResourcesScreen extends StatelessWidget {
  const ResourcesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        title: Text(
          'RESOURCES',
          style: GoogleFonts.outfit(
            fontWeight: FontWeight.w900,
            fontSize: 16,
            letterSpacing: 2.0,
          ),
        ),
        actions: [
          IconButton(
            onPressed: () {},
            icon: const Icon(Icons.search_rounded, size: 24),
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 10),
              Container(
                decoration: BoxDecoration(
                  color: AppTheme.cardBg,
                  borderRadius: BorderRadius.circular(24),
                  boxShadow: [
                    BoxShadow(
                      color: AppTheme.darkBrown.withOpacity(0.04),
                      blurRadius: 40,
                      offset: const Offset(0, 20),
                    ),
                  ],
                  border: Border.all(color: AppTheme.borderLight),
                ),
                child: Column(
                  children: [
                    // Header
                    Padding(
                      padding: const EdgeInsets.only(left: 24, right: 24, top: 24, bottom: 12),
                      child: Row(
                        children: [
                          Text(
                            'STUDENT SUCCESS LIBRARY',
                            style: GoogleFonts.outfit(
                              color: AppTheme.gold,
                              fontWeight: FontWeight.w800,
                              fontSize: 14,
                              letterSpacing: 0.8,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const Divider(color: AppTheme.borderLight, height: 1),

                    // List Items
                    _buildResourceItem(
                      context: context,
                      icon: Icons.groups_outlined,
                      title: 'Research Groups',
                      subtitle: 'Find and connect with academic research communities.',
                      routeName: 'research_groups',
                    ),
                    _buildResourceItem(
                      context: context,
                      icon: Icons.work_outline_rounded,
                      title: 'EB-1A Toolkit',
                      subtitle: 'Everything you need to build an extraordinary ability case.',
                      isNew: true,
                      routeName: 'eb1a',
                    ),
                    _buildResourceItem(
                      context: context,
                      icon: Icons.school_outlined,
                      title: 'Scholarships',
                      subtitle: 'Curated database of scholarships for international students.',
                      routeName: 'scholarships',
                    ),
                    _buildResourceItem(
                      context: context,
                      icon: Icons.attach_money_outlined,
                      title: 'Education Loan Support',
                      subtitle: 'Guidance on financing your international education.',
                      routeName: 'education_loan',
                    ),
                    _buildResourceItem(
                      context: context,
                      icon: Icons.star_outline_rounded,
                      title: 'Reviews',
                      subtitle: 'Read authentic student reviews of universities and programs.',
                      routeName: 'reviews',
                    ),

                    // Footer
                    const Divider(color: AppTheme.borderLight, height: 1),
                    InkWell(
                      onTap: () => context.push('/services'),
                      borderRadius: const BorderRadius.only(
                        bottomLeft: Radius.circular(24),
                        bottomRight: Radius.circular(24),
                      ),
                      child: Padding(
                        padding: const EdgeInsets.all(24),
                        child: Row(
                          children: [
                            Text(
                              'Visit Resources Hub',
                              style: GoogleFonts.outfit(
                                color: AppTheme.gold,
                                fontWeight: FontWeight.w700,
                                fontSize: 15,
                              ),
                            ),
                            const SizedBox(width: 8),
                            const Icon(Icons.arrow_forward_ios_rounded, size: 14, color: AppTheme.gold),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ).animate().fadeIn(duration: 600.ms).slideY(begin: 0.1, end: 0),
              
              const SizedBox(height: 30),
              
              const SizedBox(height: 20),
            ],
          ),
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
        if (routeName == 'eb1a') {
          context.push('/resources/eb1a');
        } else if (routeName == 'education_loan') {
          context.push('/resources/education-loan');
        } else if (routeName == 'scholarships') {
          context.push('/resources/scholarships');
        } else if (routeName == 'reviews') {
          context.push('/resources/reviews');
        } else {
          // Placeholder for other routes
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Coming Soon: $title')),
          );
        }
      },
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: AppTheme.gold.withOpacity(0.08),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(icon, color: AppTheme.gold, size: 22),
            ),
            const SizedBox(width: 20),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Text(
                        title,
                        style: GoogleFonts.outfit(
                          fontSize: 17,
                          fontWeight: FontWeight.w700,
                          color: AppTheme.textPrimary,
                        ),
                      ),
                      if (isNew) ...[
                        const SizedBox(width: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                          decoration: BoxDecoration(
                            color: const Color(0xFFEF4444),
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Text(
                            'NEW',
                            style: GoogleFonts.outfit(
                              color: Colors.white,
                              fontSize: 14,
                              fontWeight: FontWeight.w900,
                              letterSpacing: 0.5,
                            ),
                          ),
                        ),
                      ],
                    ],
                  ),
                  const SizedBox(height: 4),
                  Text(
                    subtitle,
                    style: GoogleFonts.outfit(
                      fontSize: 14,
                      color: AppTheme.textSecondary.withOpacity(0.8),
                      height: 1.4,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(width: 12),
            Icon(Icons.arrow_forward_ios_rounded, 
              size: 14, 
              color: AppTheme.textMuted.withOpacity(0.3)
            ),
          ],
        ),
      ),
    );
  }
}
