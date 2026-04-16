import 'package:flutter/material.dart';
import '../../core/theme.dart';

class RateMyChancesScreen extends StatelessWidget {
  const RateMyChancesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        backgroundColor: AppTheme.background,
        elevation: 0,
        title: const Text('Rate My Chances', style: TextStyle(color: AppTheme.textPrimary, fontWeight: FontWeight.w900, fontSize: 20)),
        iconTheme: const IconThemeData(color: AppTheme.textPrimary),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Get instant feedback on your admission chances at top universities worldwide.',
                style: TextStyle(fontSize: 14, color: AppTheme.textSecondary, height: 1.6),
              ),
              const SizedBox(height: 24),
              _featureCard(
                title: 'Rate Your Chances',
                description: 'Advanced algorithms find your ideal university matches.',
                icon: Icons.calculate_rounded,
              ),
              const SizedBox(height: 14),
              _featureCard(
                title: 'Overall Profile Check',
                description: 'In-depth analysis for a complete picture of your strengths.',
                icon: Icons.verified_rounded,
              ),
              const SizedBox(height: 14),
              _featureCard(
                title: 'Improvements Detailed',
                description: 'Expert-level guidance on how to strengthen your profile.',
                icon: Icons.assignment_rounded,
              ),
              const SizedBox(height: 14),
              _featureCard(
                title: 'Quick Evaluations',
                description: 'Instant feedback and rapid results in minutes.',
                icon: Icons.timer_rounded,
              ),
              const SizedBox(height: 14),
              _featureCard(
                title: '24/7 Access',
                description: 'Access your dashboard anywhere, anytime on any device.',
                icon: Icons.cloud_done_rounded,
              ),
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
                  child: const Text('Start Rating My Chances', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w900)),
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
}
