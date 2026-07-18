import 'package:flutter/material.dart';
import 'package:study_abroad/core/theme.dart';

class ResponsiveHeroImage extends StatelessWidget {
  final String imagePath;
  final double? aspectRatio;
  
  const ResponsiveHeroImage({
    super.key, 
    required this.imagePath,
    this.aspectRatio,
  });

  @override
  Widget build(BuildContext context) {
    Widget imageWidget = ClipRRect(
      borderRadius: BorderRadius.circular(24),
      child: Image.asset(
        imagePath,
        fit: BoxFit.cover,
        width: double.infinity,
        height: double.infinity,
        errorBuilder: (context, error, stackTrace) {
          return Container(
            width: double.infinity,
            height: double.infinity,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  AppTheme.gold.withValues(alpha: 0.2),
                  AppTheme.darkBrown.withValues(alpha: 0.8),
                ],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
            ),
            child: const Center(
              child: Icon(
                Icons.image_not_supported_outlined,
                color: Colors.white54,
                size: 48,
              ),
            ),
          );
        },
      ),
    );

    if (aspectRatio != null) {
      return AspectRatio(
        aspectRatio: aspectRatio!,
        child: imageWidget,
      );
    }
    
    return imageWidget;
  }
}
