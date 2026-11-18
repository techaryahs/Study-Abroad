import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../core/theme.dart';

class BrandLogoCard extends StatelessWidget {
  final double size;

  const BrandLogoCard({super.key, required this.size});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: AppTheme.gold,
          width: 1.5,
        ),
        boxShadow: AppTheme.goldGlow,
      ),
      child: Center(
        child: ClipRRect(
          borderRadius: BorderRadius.circular(16),
          child: Image.asset(
            'assets/images/logo_edug.png',
            width: size * 0.72,
            height: size * 0.72,
            fit: BoxFit.contain,
            errorBuilder: (_, __, ___) => Icon(
              Icons.school,
              color: AppTheme.gold,
              size: size * 0.5,
            ),
          ),
        ),
      ),
    ).animate().fadeIn(duration: 400.ms).scale(
          begin: const Offset(0.95, 0.95),
          end: const Offset(1, 1),
          duration: 400.ms,
          curve: Curves.easeOut,
        );
  }
}
