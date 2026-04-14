import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../core/theme.dart';
import '../../widgets/book_counselling_sheet.dart';

class AiServicesScreen extends StatelessWidget {
  const AiServicesScreen({super.key});

  final List<Map<String, dynamic>> _tools = const [
    {'title': 'AI Profile Analyzer', 'icon': '🤖', 'description': 'Upload your academic profile and get an instant AI-powered analysis with university match scores.', 'badge': 'FREE'},
    {'title': 'SOP Generator', 'icon': '✍️', 'description': 'Generate a personalized Statement of Purpose draft using AI, based on your profile and target universities.', 'badge': 'NEW'},
    {'title': 'University Recommender', 'icon': '🎯', 'description': 'AI-curated university recommendations based on your GPA, test scores, and research interests.', 'badge': 'FREE'},
    {'title': 'Scholarship Finder', 'icon': '💎', 'description': 'AI scans 500+ scholarships to match you with the ones you\'re most likely to win.', 'badge': 'FREE'},
    {'title': 'Essay Reviewer', 'icon': '📋', 'description': 'Get instant AI feedback on your application essays — grammar, tone, impact, and admissions alignment.', 'badge': 'BETA'},
    {'title': 'Career Path Predictor', 'icon': '🚀', 'description': 'Predict your career trajectory and ROI based on program choice, country, and specialization.', 'badge': 'NEW'},
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(title: const Text('AI Services'), backgroundColor: AppTheme.background),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF1A0A00), AppTheme.darkBrown],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(24),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('⚡', style: TextStyle(fontSize: 40)),
                const SizedBox(height: 12),
                const Text('AI-Powered\nStudy Abroad Tools',
                    style: TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.w900, height: 1.2)),
                const SizedBox(height: 8),
                Text('Smart tools to accelerate your university journey.',
                    style: TextStyle(color: Colors.white.withOpacity(0.5), fontSize: 12)),
              ],
            ),
          ).animate().fadeIn(duration: 400.ms),

          const SizedBox(height: 20),

          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2, crossAxisSpacing: 12, mainAxisSpacing: 12, childAspectRatio: 0.85,
            ),
            itemCount: _tools.length,
            itemBuilder: (_, i) {
              final t = _tools[i];
              return GestureDetector(
                onTap: () => showBookCounsellingSheet(context),
                child: Container(
                  padding: const EdgeInsets.all(18),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: AppTheme.borderLight),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(t['icon']!, style: const TextStyle(fontSize: 28)),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
                            decoration: BoxDecoration(
                              color: AppTheme.gold.withOpacity(0.15),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(t['badge']!,
                                style: const TextStyle(fontSize: 8, fontWeight: FontWeight.w800, color: AppTheme.gold, letterSpacing: 0.5)),
                          ),
                        ],
                      ),
                      const SizedBox(height: 10),
                      Text(t['title']!,
                          style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w800, color: AppTheme.textPrimary, height: 1.2)),
                      const SizedBox(height: 6),
                      Expanded(
                        child: Text(t['description']!,
                            style: const TextStyle(fontSize: 10, color: AppTheme.textSecondary, height: 1.5),
                            maxLines: 3, overflow: TextOverflow.ellipsis),
                      ),
                      const SizedBox(height: 10),
                      Row(
                        children: [
                          const Text('Try Now', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w800, color: AppTheme.gold)),
                          const Icon(Icons.arrow_forward_rounded, size: 12, color: AppTheme.gold),
                        ],
                      ),
                    ],
                  ),
                ),
              ).animate().fadeIn(delay: Duration(milliseconds: i * 60)).scale(begin: const Offset(0.95, 0.95));
            },
          ),
          const SizedBox(height: 24),
        ],
      ),
    );
  }
}
