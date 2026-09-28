import 'package:flutter/material.dart';
import 'package:study_abroad/core/theme.dart';
import 'package:study_abroad/core/utils/responsive.dart';

class WorkflowStep {
  final String title;
  final String description;

  const WorkflowStep({
    required this.title,
    required this.description,
  });
}

class ServiceWorkflowSection extends StatelessWidget {
  final String overline;
  final String title1;
  final String title2;
  final List<WorkflowStep> steps;

  const ServiceWorkflowSection({
    super.key,
    required this.overline,
    required this.title1,
    required this.title2,
    required this.steps,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.all(AppSpacing.md),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            overline,
            style: const TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.bold,
              color: AppTheme.gold,
              letterSpacing: 3,
            ),
          ),
          const SizedBox(height: 8),
          RichText(
            text: TextSpan(
              style: TextStyle(
                fontSize: Responsive.title(context),
                fontWeight: FontWeight.w900,
                color: AppTheme.darkBrown,
                height: 1.1,
              ),
              children: [
                TextSpan(text: '$title1\n'),
                TextSpan(
                  text: title2,
                  style: const TextStyle(color: AppTheme.gold),
                ),
              ],
            ),
          ),
          SizedBox(height: AppSpacing.lg),
          ...steps.asMap().entries.map((entry) {
            final index = entry.key;
            final step = entry.value;
            final stepNumber = '0${index + 1}';
            
            return Padding(
              padding: EdgeInsets.only(bottom: AppSpacing.md),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    stepNumber,
                    style: TextStyle(
                      fontSize: Responsive.title(context),
                      fontWeight: FontWeight.bold,
                      color: AppTheme.gold.withValues(alpha: 0.3),
                    ),
                  ),
                  SizedBox(width: AppSpacing.sm),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          step.title,
                          style: const TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        SizedBox(height: AppSpacing.xs),
                        Text(
                          step.description,
                          style: const TextStyle(
                            fontSize: 14,
                            color: AppTheme.textMuted,
                            fontWeight: FontWeight.w500,
                            height: 1.5,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            );
          }),
        ],
      ),
    );
  }
}
