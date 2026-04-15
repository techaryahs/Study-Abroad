import 'package:flutter/material.dart';
import '../../../core/theme.dart';

class ProfileRecommendationCard extends StatelessWidget {
  final Map<String, String> card;
  final VoidCallback onComplete;

  const ProfileRecommendationCard({
    super.key,
    required this.card,
    required this.onComplete,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 160,
      margin: const EdgeInsets.only(right: 16),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: AppTheme.borderLight),
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Colors.white, AppTheme.background.withOpacity(0.5)],
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.02),
            blurRadius: 10,
            offset: const Offset(0, 4),
          )
        ],
      ),
      child: Column(
        children: [
          // Icon with glass effect background
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppTheme.background,
              shape: BoxShape.circle,
            ),
            child: Text(
              card['icon']!,
              style: const TextStyle(fontSize: 28),
            ),
          ),
          const SizedBox(height: 16),
          
          // Title
          Text(
            card['title']!.toUpperCase(),
            textAlign: TextAlign.center,
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
            style: const TextStyle(
              fontSize: 10,
              fontWeight: FontWeight.w900,
              letterSpacing: 1.2,
              height: 1.3,
              color: AppTheme.textPrimary,
            ),
          ),
          
          const Spacer(),
          
          // Action Button
          GestureDetector(
            onTap: onComplete,
            child: Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(vertical: 10),
              decoration: BoxDecoration(
                color: AppTheme.darkBrown,
                borderRadius: BorderRadius.circular(12),
                boxShadow: [
                  BoxShadow(
                    color: AppTheme.darkBrown.withOpacity(0.2),
                    blurRadius: 8,
                    offset: const Offset(0, 4),
                  )
                ],
              ),
              child: const Center(
                child: Text(
                  'COMPLETE',
                  style: TextStyle(
                    color: AppTheme.gold,
                    fontSize: 8.5,
                    fontWeight: FontWeight.w900,
                    letterSpacing: 1.5,
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
