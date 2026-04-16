import 'package:flutter/material.dart';
import '../../core/theme.dart';

class UniPredictScreen extends StatelessWidget {
  const UniPredictScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        backgroundColor: AppTheme.background,
        elevation: 0,
        title: const Text('UniPredict', style: TextStyle(color: AppTheme.textPrimary, fontWeight: FontWeight.w900, fontSize: 20)),
        iconTheme: const IconThemeData(color: AppTheme.textPrimary),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Predict your admit chances for top universities using your profile data.',
                style: TextStyle(fontSize: 14, color: AppTheme.textSecondary, height: 1.6),
              ),
              const SizedBox(height: 24),
              _featureCard(
                title: 'Smart Profile Assessment',
                description: 'Answer a few questions about academics, test scores, and achievements.',
                icon: Icons.analytics_rounded,
              ),
              const SizedBox(height: 14),
              _featureCard(
                title: 'University Fit Score',
                description: 'Get a data-backed score for top universities based on your profile.',
                icon: Icons.school_rounded,
              ),
              const SizedBox(height: 14),
              _featureCard(
                title: 'Guided Next Steps',
                description: 'See where to improve your application and which programs to target.',
                icon: Icons.lightbulb_rounded,
              ),
              const SizedBox(height: 24),
              const Text('How it works', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: AppTheme.textPrimary)),
              const SizedBox(height: 12),
              ..._steps.map((step) => _stepTile(step['title'] as String, step['subtitle'] as String)).toList(),
              const Spacer(),
              SizedBox(
                width: double.infinity,
                height: 56,
                child: ElevatedButton(
                  onPressed: () {},
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.gold,
                    foregroundColor: AppTheme.darkBrown,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  ),
                  child: const Text('Start UniPredict', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w900)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _featureCard({required String title, required String description, required IconData icon}) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppTheme.borderLight),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(
              color: AppTheme.gold.withOpacity(0.15),
              borderRadius: BorderRadius.circular(14),
            ),
            child: Icon(icon, size: 24, color: AppTheme.gold),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w900, color: AppTheme.textPrimary)),
                const SizedBox(height: 8),
                Text(description, style: const TextStyle(fontSize: 13, color: AppTheme.textSecondary, height: 1.6)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _stepTile(String title, String subtitle) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            margin: const EdgeInsets.only(top: 4),
            width: 24,
            height: 24,
            decoration: const BoxDecoration(
              color: AppTheme.gold,
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.check, size: 14, color: AppTheme.darkBrown),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w900, color: AppTheme.textPrimary)),
                const SizedBox(height: 4),
                Text(subtitle, style: const TextStyle(fontSize: 13, color: AppTheme.textSecondary, height: 1.5)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  static final List<Map<String, String>> _steps = [
    {'title': 'Review your profile', 'subtitle': 'Input academic scores, language scores, and achievements.'},
    {'title': 'Choose target universities', 'subtitle': 'Choose the types of colleges you want to apply to.'},
    {'title': 'Receive a fit score', 'subtitle': 'Get a chance rating and recommendations for improvement.'},
  ];
}
