import 'package:flutter/material.dart';
import '../../core/theme.dart';
import '../../core/utils/responsive.dart';

class ServiceHeroCard extends StatelessWidget {
  final String title;
  final String highlightTitle;
  final String subtitle;
  final String tag;
  final VoidCallback onCtaPressed;
  final String ctaText;
  final Widget? extraContent;

  const ServiceHeroCard({
    super.key,
    required this.title,
    required this.highlightTitle,
    required this.subtitle,
    required this.tag,
    required this.onCtaPressed,
    required this.ctaText,
    this.extraContent,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [
            AppTheme.gold.withValues(alpha: 0.1),
            Colors.transparent,
          ],
        ),
      ),
      padding: EdgeInsets.fromLTRB(AppSpacing.md, AppSpacing.xl, AppSpacing.md, AppSpacing.xxl),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
            decoration: BoxDecoration(
              border: Border.all(color: AppTheme.gold.withValues(alpha: 0.3)),
              borderRadius: BorderRadius.circular(24),
            ),
            child: Text(
              tag.toUpperCase(),
              style: const TextStyle(
                color: AppTheme.gold,
                fontSize: 11,
                fontWeight: FontWeight.bold,
                letterSpacing: 2.0,
              ),
            ),
          ),
          SizedBox(height: AppSpacing.md),
          Text(
            title,
            style: Theme.of(context).textTheme.headlineLarge?.copyWith(
                  height: 1.1,
                  fontSize: Responsive.title(context),
                ),
          ),
          Text(
            highlightTitle,
            style: Theme.of(context).textTheme.headlineLarge?.copyWith(
                  height: 1.1,
                  color: AppTheme.gold,
                  fontSize: Responsive.title(context),
                ),
          ),
          SizedBox(height: AppSpacing.md),
          Text(
            subtitle,
            style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                  fontStyle: FontStyle.italic,
                  fontSize: 16,
                  height: 1.6,
                ),
          ),
          SizedBox(height: AppSpacing.lg),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: onCtaPressed,
              child: Text(ctaText),
            ),
          ),
          if (extraContent != null) ...[
            SizedBox(height: AppSpacing.sm),
            extraContent!,
          ],
        ],
      ),
    );
  }
}
