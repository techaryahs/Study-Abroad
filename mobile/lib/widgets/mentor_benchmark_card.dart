import 'package:flutter/material.dart';
import 'package:study_abroad/core/theme.dart';
import 'package:study_abroad/core/utils/responsive.dart';

class BenchmarkScore {
  final String label;
  final String value;

  const BenchmarkScore({
    required this.label,
    required this.value,
  });
}

class MentorBenchmarkCard extends StatelessWidget {
  final String title;
  final String subtitle;
  final bool hasPulse;
  final String scoreLabel;
  final String score;
  final String maxScore;
  final List<BenchmarkScore> scores;
  final List<String>? checklistItems;
  final String? insightTitle;
  final String? insightText;

  const MentorBenchmarkCard({
    super.key,
    required this.title,
    this.subtitle = '',
    this.hasPulse = false,
    required this.scoreLabel,
    required this.score,
    required this.maxScore,
    required this.scores,
    this.checklistItems,
    this.insightTitle,
    this.insightText,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(28),
        border: Border.all(color: AppTheme.gold.withValues(alpha: 0.15)),
        boxShadow: [
          BoxShadow(
            color: AppTheme.gold.withValues(alpha: 0.05),
            blurRadius: 40,
            offset: const Offset(0, 20),
          ),
        ],
      ),
      child: Column(
        children: [
          // Header
          Container(
            padding: EdgeInsets.symmetric(horizontal: AppSpacing.md, vertical: AppSpacing.sm),
            decoration: BoxDecoration(
              color: AppTheme.darkBrown,
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(28),
                topRight: Radius.circular(28),
              ),
            ),
            child: Row(
              children: [
                Expanded(
                  child: Row(
                    children: [
                      const Icon(Icons.emoji_events, color: AppTheme.gold, size: 20),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Text(
                          title.toUpperCase(),
                          maxLines: 2,
                          style: const TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                            letterSpacing: 2,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                if (hasPulse || subtitle.isNotEmpty) const SizedBox(width: 8),
                if (hasPulse)
                  Container(
                    width: 12,
                    height: 12,
                    decoration: const BoxDecoration(
                      color: Colors.green,
                      shape: BoxShape.circle,
                    ),
                  )
                else if (subtitle.isNotEmpty)
                  Flexible(
                    child: Text(
                      subtitle.toUpperCase(),
                      maxLines: 2,
                      textAlign: TextAlign.right,
                      style: const TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.gold,
                        letterSpacing: 2,
                      ),
                    ),
                  ),
              ],
            ),
          ),
          
          // Body
          Container(
            padding: EdgeInsets.all(AppSpacing.xl),
            decoration: const BoxDecoration(
              color: AppTheme.backgroundAlt,
              borderRadius: BorderRadius.only(
                bottomLeft: Radius.circular(28),
                bottomRight: Radius.circular(28),
              ),
            ),
            child: Column(
              children: [
                // Score
                Text(
                  scoreLabel.toUpperCase(),
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                    color: AppTheme.darkBrown.withValues(alpha: 0.4),
                    letterSpacing: 3,
                  ),
                ),
                const SizedBox(height: 8),
                RichText(
                  text: TextSpan(
                    style: TextStyle(
                      fontSize: Responsive.title(context) * 1.5,
                      fontWeight: FontWeight.w900,
                      color: AppTheme.gold,
                    ),
                    children: [
                      TextSpan(
                        text: score,
                        style: const TextStyle(color: AppTheme.darkBrown),
                      ),
                      TextSpan(
                        text: ' /$maxScore',
                        style: TextStyle(
                          fontSize: Responsive.title(context) * 0.6,
                          color: AppTheme.darkBrown.withValues(alpha: 0.2),
                        ),
                      ),
                    ],
                  ),
                ),
                
                SizedBox(height: AppSpacing.lg),
                
                // Grid
                if (scores.length == 3)
                  Container(
                    padding: const EdgeInsets.symmetric(vertical: 24),
                    decoration: BoxDecoration(
                      border: Border(
                        top: BorderSide(color: AppTheme.gold.withValues(alpha: 0.1)),
                        bottom: BorderSide(color: AppTheme.gold.withValues(alpha: 0.1)),
                      ),
                    ),
                    child: Wrap(
                      spacing: AppSpacing.md,
                      runSpacing: AppSpacing.md,
                      alignment: WrapAlignment.center,
                      children: scores.asMap().entries.map((entry) {
                        final index = entry.key;
                        final s = entry.value;
                        return Container(
                          padding: EdgeInsets.symmetric(horizontal: AppSpacing.sm),
                          decoration: BoxDecoration(
                            border: index == 1 && Responsive.isTablet(context) ? Border(
                              left: BorderSide(color: AppTheme.gold.withValues(alpha: 0.1)),
                              right: BorderSide(color: AppTheme.gold.withValues(alpha: 0.1)),
                            ) : null,
                          ),
                          child: Column(
                            children: [
                              Text(
                                s.value,
                                style: const TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                  color: AppTheme.darkBrown,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                s.label.toUpperCase(),
                                style: const TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w900,
                                  color: AppTheme.gold,
                                  letterSpacing: 2,
                                ),
                              ),
                            ],
                          ),
                        );
                      }).toList(),
                    ),
                  )
                else
                  Wrap(
                    spacing: AppSpacing.sm,
                    runSpacing: AppSpacing.sm,
                    children: scores.map((s) => Container(
                      width: Responsive.isSmall(context) ? double.infinity : 140,
                      padding: EdgeInsets.all(AppSpacing.sm),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: AppTheme.gold.withValues(alpha: 0.1)),
                      ),
                      child: Row(
                        children: [
                          Expanded(
                            child: Text(
                              s.label.toUpperCase(),
                              maxLines: 2,
                              style: TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.bold,
                                color: AppTheme.darkBrown.withValues(alpha: 0.4),
                                letterSpacing: 2,
                              ),
                            ),
                          ),
                          const SizedBox(width: 8),
                          Text(
                            s.value,
                            style: const TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w900,
                              color: AppTheme.gold,
                            ),
                          ),
                        ],
                      ),
                    )).toList(),
                  ),
                
                // Checklist
                if (checklistItems != null) ...[
                  const SizedBox(height: 32),
                  ...checklistItems!.map((item) => Padding(
                    padding: const EdgeInsets.only(bottom: 16.0),
                    child: Row(
                      children: [
                        const Icon(Icons.check_circle_outline, color: AppTheme.gold, size: 20),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Text(
                            item,
                            style: const TextStyle(
                              fontSize: 14,
                              color: AppTheme.darkBrown,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ),
                      ],
                    ),
                  )),
                ],
                
                // Insight
                if (insightTitle != null && insightText != null) ...[
                  const SizedBox(height: 32),
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(24),
                    decoration: BoxDecoration(
                      color: AppTheme.darkBrown,
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          insightTitle!.toUpperCase(),
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.bold,
                            color: Colors.white.withValues(alpha: 0.6),
                            letterSpacing: 3,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          insightText!,
                          style: const TextStyle(
                            fontSize: 14,
                            color: Colors.white,
                            fontStyle: FontStyle.italic,
                            height: 1.5,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }
}
