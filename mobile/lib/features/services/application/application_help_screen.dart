import 'package:flutter/material.dart';
import '../../../core/theme.dart';
import '../../../widgets/service_hero_card.dart';

class ApplicationHelpScreen extends StatelessWidget {
  const ApplicationHelpScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.backgroundAlt,
      appBar: AppBar(
        title: const Text('Application Help', style: TextStyle(color: AppTheme.darkBrown)),
        backgroundColor: AppTheme.backgroundAlt,
        elevation: 0,
        iconTheme: const IconThemeData(color: AppTheme.darkBrown),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          child: ConstrainedBox(
            constraints: BoxConstraints(
              minHeight: MediaQuery.sizeOf(context).height,
            ),
            child: Column(
          children: [
            ServiceHeroCard(
              tag: 'Admissions • Premium Mentorship',
              title: 'COMPLETE ',
              highlightTitle: 'APPLICATION HELP',
              subtitle: 'The only service in the market with an admissions and visa guarantee. Top universities. No BS.',
              ctaText: 'Access Service',
              onCtaPressed: () {},
            ),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'VALID CATEGORIES',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w900,
                      letterSpacing: 2,
                      color: AppTheme.darkBrown,
                    ),
                  ),
                  const SizedBox(height: 16),
                  Wrap(
                    spacing: 16,
                    runSpacing: 12,
                    children: [
                      "Bachelor's", "Diploma", "Master's", "Ph.D.", "Transfer Apps", "MBA Specialists"
                    ].map((item) => Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Container(
                          width: 6,
                          height: 6,
                          decoration: const BoxDecoration(
                            color: AppTheme.gold,
                            shape: BoxShape.circle,
                          ),
                        ),
                        const SizedBox(width: 8),
                        Text(item, style: const TextStyle(fontSize: 13, color: AppTheme.textMuted, fontStyle: FontStyle.italic)),
                      ],
                    )).toList(),
                  ),
                  
                  const SizedBox(height: 40),
                  
                  Container(
                    width: double.infinity,
                    padding: EdgeInsets.all(AppSpacing.md),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      border: Border.all(color: AppTheme.gold.withValues(alpha: 0.2)),
                      borderRadius: BorderRadius.circular(24),
                    ),
                    child: Column(
                      children: [
                        const Text(
                          'GLOBAL PLACEMENT DISTRIBUTION',
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w900,
                            letterSpacing: 2,
                            color: AppTheme.darkBrown,
                          ),
                        ),
                        const SizedBox(height: 24),
                        _buildStatBar('United States', '10k+', 0.95),
                        _buildStatBar('United Kingdom', '3k+', 0.55),
                        _buildStatBar('Australia', '4k+', 0.65),
                        _buildStatBar('Canada', '2k+', 0.40),
                        _buildStatBar('Germany', '1k+', 0.25),
                      ],
                    ),
                  ),

                  const SizedBox(height: 40),
                  
                  // Infinity Stats Box
                  Container(
                    width: double.infinity,
                    decoration: BoxDecoration(
                      color: Colors.white,
                      border: Border.all(color: AppTheme.gold.withValues(alpha: 0.2)),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Row(
                      children: [
                        _buildInfinityStat('22%', 'FULL FUNDING', true),
                        _buildDivider(),
                        _buildInfinityStat('∞', 'PRIORITY SUPPORT', false),
                        _buildDivider(),
                        _buildInfinityStat('83%', 'SCHOLARSHIP >\$10K', true),
                      ],
                    ),
                  ),

                  const SizedBox(height: 40),
                  const Text(
                    'INCLUSIVE CONCIERGE SERVICES',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w900,
                      letterSpacing: 2,
                      color: AppTheme.darkBrown,
                      fontStyle: FontStyle.italic,
                    ),
                  ),
                  const SizedBox(height: 16),
                  _buildIncludeItem('🏫', 'University Shortlisting & Profile Evaluation'),
                  _buildIncludeItem('👤', 'Strategic Profile Building Advice'),
                  _buildIncludeItem('📄', '3 Letters of Recommendation'),
                  _buildIncludeItem('✍️', 'SOP & MBA Essay Crafting'),
                  _buildIncludeItem('💼', 'Executive Resume Overhaul'),
                  _buildIncludeItem('📅', 'Unlimited Expert Video Consultations'),
                  const SizedBox(height: 32),
                ],
              ),
            ),
          ],
        ),
            ),
          ),
        ),
      );
  }

  Widget _buildStatBar(String country, String count, double percent) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16.0),
      child: Row(
        children: [
          SizedBox(
            width: 100,
            child: Text(
              country.toUpperCase(),
              style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AppTheme.textMuted),
            ),
          ),
          Expanded(
            child: Container(
              height: 4,
              decoration: BoxDecoration(
                color: AppTheme.gold.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(2),
              ),
              child: FractionallySizedBox(
                alignment: Alignment.centerLeft,
                widthFactor: percent,
                child: Container(
                  decoration: BoxDecoration(
                    color: AppTheme.gold,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
            ),
          ),
          const SizedBox(width: 12),
          Text(count, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w900, color: AppTheme.gold)),
        ],
      ),
    );
  }

  Widget _buildIncludeItem(String icon, String title) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border.all(color: AppTheme.gold.withValues(alpha: 0.1)),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        children: [
          Text(icon, style: const TextStyle(fontSize: 20)),
          const SizedBox(width: 16),
          Expanded(
            child: Text(
              title,
              style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppTheme.textMuted),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInfinityStat(String value, String label, bool isGold) {
    return Expanded(
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 24, horizontal: 8),
        child: Column(
          children: [
            Text(
              value,
              style: TextStyle(
                fontSize: 32,
                fontWeight: FontWeight.w300,
                color: isGold ? AppTheme.gold : AppTheme.darkBrown,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              label,
              textAlign: TextAlign.center,
              style: const TextStyle(
                fontSize: 10,
                fontWeight: FontWeight.w900,
                letterSpacing: 1.5,
                color: AppTheme.textMuted,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDivider() {
    return Container(
      height: 80,
      width: 1,
      color: AppTheme.gold.withValues(alpha: 0.1),
    );
  }
}
