import 'package:flutter/material.dart';
import '../../../core/theme.dart';
import 'profile_progress_bar.dart';
import 'profile_recommendation_card.dart';
import 'package:flutter_animate/flutter_animate.dart';

class DashboardProgressSection extends StatelessWidget {
  final int completedSteps;
  final List<Map<String, String>> pendingCards;
  final Function(Map<String, String>) onCompleteCard;

  const DashboardProgressSection({
    super.key,
    required this.completedSteps,
    required this.pendingCards,
    required this.onCompleteCard,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 24),
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: AppTheme.borderLight),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.02),
            blurRadius: 20,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          ProfileProgressBar(completed: completedSteps),
          const SizedBox(height: 24),
          if (pendingCards.isNotEmpty) ...[
            const Text(
              'MISSING SECTIONS',
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w900,
                color: AppTheme.textSecondary,
                letterSpacing: 1.5,
              ),
            ),
            const SizedBox(height: 16),
            SizedBox(
              height: 180,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                physics: const BouncingScrollPhysics(),
                itemCount: pendingCards.length,
                itemBuilder: (context, i) {
                  return ProfileRecommendationCard(
                    card: pendingCards[i],
                    onComplete: () => onCompleteCard(pendingCards[i]),
                  );
                },
              ),
            ),
          ] else ...[
            Container(
              padding: const EdgeInsets.symmetric(vertical: 20),
              width: double.infinity,
              decoration: BoxDecoration(
                color: Colors.green.withOpacity(0.05),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Column(
                children: [
                  const Icon(Icons.verified, color: Colors.green, size: 32),
                  const SizedBox(height: 12),
                  const Text(
                    "PROFILE 100% COMPLETE",
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w900,
                      color: AppTheme.textPrimary,
                      letterSpacing: 1.2,
                    ),
                  ),
                  const SizedBox(height: 4),
                  const Text(
                    "You are ready for applications.",
                    style: TextStyle(fontSize: 13, color: AppTheme.textSecondary),
                  ),
                ],
              ),
            ),
          ]
        ],
      ),
    ).animate().fadeIn(delay: 200.ms).slideY(begin: 0.05);
  }
}
