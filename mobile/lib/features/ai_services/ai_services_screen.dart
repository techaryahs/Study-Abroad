import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/theme.dart';
import '../../widgets/edu_components.dart';

class AiServicesScreen extends StatelessWidget {
  const AiServicesScreen({super.key});

  final List<Map<String, dynamic>> _tools = const [
    {
      'id': 'mock-interview',
      'title': 'US Visa Mock Interview AI',
      'icon': Icons.videocam_rounded,
      'description': 'Simulate real visa consular questions with real-time feedback.',
      'accent': 'from-[#2ca59d] to-[#0f4c5c]',
    },
    {
      'id': 'plagiarism-remover',
      'title': 'AI & Plagiarism Remover Tool',
      'icon': Icons.auto_fix_high_rounded,
      'description': 'Polish and humanize your application drafts before submission.',
      'accent': 'from-[#d2a14a] to-[#8a5f16]',
    },
    {
      'id': 'sop-generator',
      'title': 'AI SOP Generator',
      'icon': Icons.edit_note_rounded,
      'description': 'Create a tailored, admissions-ready statement of purpose in minutes.',
      'accent': 'from-[#2ca59d] to-[#0f4c5c]',
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
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 18, color: AppTheme.navy),
          onPressed: () => context.canPop() ? context.pop() : context.go('/'),
        ),
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
                    label: 'Admissions Intelligence',
                    icon: Icons.psychology_rounded,
                    backgroundColor: Color(0x332CA59D),
                    textColor: AppTheme.goldLight,
                    borderColor: Color(0x442CA59D),
                  ),
                  const SizedBox(height: 14),
                  Text(
                    'AI-Forged\nFuture Protocols',
                    style: GoogleFonts.playfairDisplay(
                      color: Colors.white,
                      fontSize: 28,
                      fontWeight: FontWeight.w800,
                      height: 1.15,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Experience the next generation of admissions intelligence. Research-driven protocols ensure your profile stands out.',
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
              tagline: 'Protocols',
              title: 'Featured AI Suites',
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
                children: List.generate(_tools.length, (index) {
                  final tool = _tools[index];
                  final isLast = index == _tools.length - 1;

                  return Column(
                    children: [
                      _buildToolItem(context, tool),
                      if (!isLast) const Divider(color: AppTheme.borderLight, height: 1),
                    ],
                  );
                }),
              ),
            ).animate().fadeIn(duration: 500.ms).slideY(begin: 0.05),

            const SizedBox(height: 24),

            // FAQ Button
            GestureDetector(
              onTap: () => context.push('/faq'),
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 18),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: AppTheme.borderLight),
                  boxShadow: AppTheme.cardShadow,
                ),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: AppTheme.teal.withValues(alpha: 0.12),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Icon(
                        Icons.help_outline_rounded,
                        color: AppTheme.tealDark,
                        size: 20,
                      ),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Text(
                        'Frequently Asked Questions',
                        style: GoogleFonts.inter(
                          fontSize: 14,
                          fontWeight: FontWeight.w900,
                          color: AppTheme.navy,
                        ),
                      ),
                    ),
                    const Icon(
                      Icons.arrow_forward_ios_rounded,
                      color: AppTheme.textSecondary,
                      size: 14,
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 36),
          ],
        ),
      ),
    );
  }

  Widget _buildToolItem(BuildContext context, Map<String, dynamic> tool) {
    return InkWell(
      onTap: () {
        if (tool['id'] == 'sop-generator') {
          context.push('/ai-services/sop-generator');
        } else if (tool['id'] == 'mock-interview') {
          context.push('/ai-services/mock-interview');
        } else if (tool['id'] == 'plagiarism-remover') {
          context.push('/ai-services/plagiarism-remover');
        }
      },
      child: Padding(
        padding: const EdgeInsets.all(20),
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
              child: Icon(tool['icon'] as IconData, color: AppTheme.navy, size: 24),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    tool['title'] as String,
                    style: GoogleFonts.inter(
                      fontSize: 16,
                      fontWeight: FontWeight.w900,
                      color: AppTheme.navy,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    tool['description'] as String,
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
