import 'package:flutter/material.dart';
import '../../core/theme.dart';

class ServiceFaq {
  final String question;
  final String answer;

  const ServiceFaq({required this.question, required this.answer});
}

class ServiceFaqSection extends StatelessWidget {
  final List<ServiceFaq> faqs;

  const ServiceFaqSection({super.key, required this.faqs});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const SizedBox(height: 32),
        const Text(
          'FREQUENTLY ASKED QUESTIONS',
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.w900,
            color: AppTheme.darkBrown,
            letterSpacing: 1.5,
          ),
        ),
        const SizedBox(height: 16),
        ...faqs.map((faq) => _buildFaqItem(faq)),
      ],
    );
  }

  Widget _buildFaqItem(ServiceFaq faq) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border.all(color: AppTheme.gold.withValues(alpha: 0.2)),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Theme(
        data: ThemeData(dividerColor: Colors.transparent),
        child: ExpansionTile(
          iconColor: AppTheme.gold,
          collapsedIconColor: AppTheme.gold,
          title: Text(
            faq.question,
            style: const TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.bold,
              color: AppTheme.darkBrown,
            ),
          ),
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
              child: Text(
                faq.answer,
                style: const TextStyle(
                  fontSize: 13,
                  color: AppTheme.textMuted,
                  height: 1.5,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
