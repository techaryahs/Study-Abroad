import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../core/theme.dart';
import '../../widgets/book_counselling_sheet.dart';

class AboutScreen extends StatelessWidget {
  const AboutScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(title: const Text('About Us'), backgroundColor: AppTheme.background),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Hero
          Container(
            padding: const EdgeInsets.all(28),
            decoration: BoxDecoration(
              color: AppTheme.darkBrown,
              borderRadius: BorderRadius.circular(24),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('🌏', style: TextStyle(fontSize: 48)),
                const SizedBox(height: 16),
                const Text('Guiding Dreams\nAcross Borders',
                    style: TextStyle(color: Colors.white, fontSize: 26, fontWeight: FontWeight.w900, height: 1.2)),
                const SizedBox(height: 12),
                Text(
                  'Personalized higher study guidance for USA, UK, Germany, Australia, Ireland, and Dubai — powered by AI-driven support.',
                  style: TextStyle(color: Colors.white.withOpacity(0.6), fontSize: 13, height: 1.6),
                ),
              ],
            ),
          ).animate().fadeIn(duration: 400.ms),

          const SizedBox(height: 20),

          // Stats
          Row(children: [
            _statCard('1000+', 'Students Guided'),
            const SizedBox(width: 12),
            _statCard('360+', 'Universities'),
          ]),
          const SizedBox(height: 12),
          Row(children: [
            _statCard('15+', 'Countries'),
            const SizedBox(width: 12),
            _statCard('98%', 'Success Rate'),
          ]),

          const SizedBox(height: 24),

          // About Dr. Alam section
          _sectionCard(
            '👨‍🏫',
            'Our Founder',
            'Led by a distinguished education leader with 15+ years of experience placing students in Ivy League and top global universities. Our founder has personally guided thousands of students to achieve their dreams of studying abroad.',
          ).animate().fadeIn(delay: 200.ms),

          const SizedBox(height: 12),

          _sectionCard(
            '🎯',
            'Our Mission',
            'To make world-class education accessible to every deserving student through personalized guidance, AI-powered tools, and a dedicated team of experts.',
          ).animate().fadeIn(delay: 300.ms),

          const SizedBox(height: 12),

          _sectionCard(
            '💡',
            'Our Approach',
            'We combine human expertise with AI-driven profile analysis to give each student a unique, data-backed roadmap — from university selection to visa approval.',
          ).animate().fadeIn(delay: 400.ms),

          const SizedBox(height: 24),

          SizedBox(
            width: double.infinity,
            height: 56,
            child: ElevatedButton(
              onPressed: () => showBookCounsellingSheet(context),
              child: const Text('BOOK FREE COUNSELLING', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w800, letterSpacing: 1.5)),
            ),
          ),

          const SizedBox(height: 32),
        ],
      ),
    );
  }

  Widget _statCard(String value, String label) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(18),
          border: Border.all(color: AppTheme.borderLight),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(value, style: const TextStyle(fontSize: 28, fontWeight: FontWeight.w900, color: AppTheme.textPrimary, letterSpacing: -1)),
            const SizedBox(height: 4),
            Text(label.toUpperCase(),
                style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w800, letterSpacing: 1.5, color: AppTheme.textSecondary)),
          ],
        ),
      ),
    );
  }

  Widget _sectionCard(String emoji, String title, String body) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: AppTheme.borderLight),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(emoji, style: const TextStyle(fontSize: 32)),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: AppTheme.textPrimary)),
                const SizedBox(height: 6),
                Text(body, style: const TextStyle(fontSize: 14, color: AppTheme.textSecondary, height: 1.6)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
