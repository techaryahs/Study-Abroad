import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';

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
          color: const Color(0xFFC49A28), // IEC Gold
          width: 1.5,
        ),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFFC49A28).withOpacity(0.2),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Center(
        child: ClipRRect(
          borderRadius: BorderRadius.circular(18),
          child: Image.asset(
            'assets/images/logo_iec.png',
            width: size * 0.7,
            height: size * 0.7,
            fit: BoxFit.contain,
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
