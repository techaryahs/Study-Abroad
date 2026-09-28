import 'package:flutter/material.dart';
import '../../core/theme.dart';
import '../../core/utils/responsive.dart';

class ServiceFeatureItem {
  final String title;
  final String desc;
  final IconData icon;

  const ServiceFeatureItem({
    required this.title,
    required this.desc,
    required this.icon,
  });
}

class ServiceFeatureGrid extends StatelessWidget {
  final String overline;
  final String title1;
  final String title2;
  final List<ServiceFeatureItem> features;

  const ServiceFeatureGrid({
    super.key,
    required this.overline,
    required this.title1,
    required this.title2,
    required this.features,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.symmetric(
        horizontal: AppSpacing.md,
        vertical: AppSpacing.xxl,
      ),
      child: Column(
        children: [
          Text(
            overline.toUpperCase(),
            style: const TextStyle(
              color: AppTheme.gold,
              fontSize: 11,
              fontWeight: FontWeight.bold,
              letterSpacing: 3.0,
            ),
          ),
          SizedBox(height: AppSpacing.sm),
          RichText(
            textAlign: TextAlign.center,
            text: TextSpan(
              style: Theme.of(context).textTheme.headlineLarge,
              children: [
                TextSpan(text: '$title1 '),
                TextSpan(
                  text: title2,
                  style: const TextStyle(color: AppTheme.gold),
                ),
              ],
            ),
          ),
          SizedBox(height: AppSpacing.xxl),
          LayoutBuilder(
            builder: (context, constraints) {
              final int columns = Responsive.gridColumns(context);
              final double spacing = AppSpacing.sm;
              double itemWidth = (constraints.maxWidth - (spacing * (columns - 1))) / columns;
              if (itemWidth < 140) {
                itemWidth = constraints.maxWidth;
              }

              return Wrap(
                spacing: spacing,
                runSpacing: spacing,
                children: features.map((feat) {
                  return SizedBox(
                    width: itemWidth,
                    child: Container(
                      padding: EdgeInsets.all(AppSpacing.md),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        border: Border.all(color: AppTheme.gold.withValues(alpha: 0.1)),
                        borderRadius: BorderRadius.circular(24),
                        boxShadow: [
                          BoxShadow(
                            color: AppTheme.gold.withValues(alpha: 0.05),
                            blurRadius: 20,
                            offset: const Offset(0, 10),
                          ),
                        ],
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Container(
                            width: 48,
                            height: 48,
                            decoration: BoxDecoration(
                              color: AppTheme.background,
                              border: Border.all(
                                color: AppTheme.gold.withValues(alpha: 0.1),
                              ),
                              borderRadius: BorderRadius.circular(16),
                            ),
                            child: Center(
                              child: Icon(feat.icon, color: AppTheme.gold, size: 24),
                            ),
                          ),
                          SizedBox(height: AppSpacing.md),
                          Text(
                            feat.title,
                            style: Theme.of(context).textTheme.titleLarge,
                          ),
                          SizedBox(height: AppSpacing.sm),
                          Text(
                            feat.desc,
                            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                                  height: 1.5,
                                  fontSize: Responsive.body(context),
                                ),
                          ),
                        ],
                      ),
                    ),
                  );
                }).toList(),
              );
            },
          ),
        ],
      ),
    );
  }
}
