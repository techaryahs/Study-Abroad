import 'package:flutter/material.dart';
import 'quick_action_card.dart';
import 'package:flutter_animate/flutter_animate.dart';

class QuickActionsGrid extends StatelessWidget {
  final VoidCallback onBookingsTap;
  final VoidCallback onSessionsTap;
  final VoidCallback onUniversitiesTap;
  final VoidCallback onAiServicesTap;

  const QuickActionsGrid({
    super.key,
    required this.onBookingsTap,
    required this.onSessionsTap,
    required this.onUniversitiesTap,
    required this.onAiServicesTap,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'QUICK ACTIONS',
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w900,
              letterSpacing: 1.5,
              color: Colors.black87,
            ),
          ),
          const SizedBox(height: 16),
          GridView.count(
            crossAxisCount: 2,
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            mainAxisSpacing: 16,
            crossAxisSpacing: 16,
            childAspectRatio: 1.1,
            children: [
              QuickActionCard(
                icon: Icons.calendar_today,
                title: 'My Bookings',
                subtitle: 'View history',
                onTap: onBookingsTap,
              ),
              QuickActionCard(
                icon: Icons.video_camera_front,
                title: 'My Sessions',
                subtitle: 'Upcoming calls',
                onTap: onSessionsTap,
              ),
              QuickActionCard(
                icon: Icons.school,
                title: 'Universities',
                subtitle: 'Saved list',
                onTap: onUniversitiesTap,
              ),
              QuickActionCard(
                icon: Icons.auto_awesome,
                title: 'AI Services',
                subtitle: 'Smart tools',
                onTap: onAiServicesTap,
              ),
            ],
          ).animate().fadeIn(duration: 500.ms).slideY(begin: 0.1),
        ],
      ),
    );
  }
}
