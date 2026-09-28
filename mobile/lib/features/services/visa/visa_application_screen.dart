import 'package:flutter/material.dart';
import '../../../core/theme.dart';
import '../../../widgets/book_counselling_sheet.dart';
import '../../../widgets/service_hero_card.dart';

class VisaApplicationScreen extends StatefulWidget {
  const VisaApplicationScreen({super.key});

  @override
  State<VisaApplicationScreen> createState() => _VisaApplicationScreenState();
}

class _VisaApplicationScreenState extends State<VisaApplicationScreen> {
  String _activeCountry = 'USA';
  final List<String> _countries = ['USA', 'Canada', 'UK'];
  
  final Map<String, String> _flags = {
    'USA': '🇺🇸',
    'Canada': '🇨🇦',
    'UK': '🇬🇧',
  };

  final Map<String, Map<String, dynamic>> _content = {
    'USA': {
      'highlightTitle': 'Quick Appointments',
      'highlightDesc': 'Leverage the best-in-class 24/7 visa monitoring and faster appointment booking without any effort needed on your end.',
      'features': [
        {'icon': Icons.description_outlined, 'title': 'Visa Documentation', 'desc': 'Ensure correctness in the DS-160 & Visa Portal to minimize the chances of rejections.'},
        {'icon': Icons.attach_money, 'title': 'Financial Documentation', 'desc': 'Prove the right amount of finances needed to get your visa.'},
        {'icon': Icons.theater_comedy_outlined, 'title': 'Mock Interviews', 'desc': 'Get tailored training for your case on tackling the visa interview with confidence.'},
        {'icon': Icons.phone_android, 'title': 'Social Media Vetting', 'desc': 'We vet your social media beforehand to ensure compliance.'},
      ]
    },
    'Canada': {
      'intro': "Whether it's the Canadian Study Permit, Work Permit, or Temporary Resident (Tourist) Visa, here's how we make it smooth for you.",
      'highlightTitle': 'Picking the Right Stream',
      'highlightDesc': "We'll see which study permit stream suits you best, whether it's SDS or General.",
      'features': [
        {'icon': Icons.description_outlined, 'title': 'Visa Documentation', 'desc': 'Ensure correctness in the GCKey Visa Application to minimize the chances of rejections.'},
        {'icon': Icons.attach_money, 'title': 'Financial Documentation', 'desc': 'Prove the right amount of finances needed to get your visa.'},
        {'icon': Icons.theater_comedy_outlined, 'title': 'Mock Interviews', 'desc': 'Get tailored training for your case on tackling the visa interview with confidence.'},
        {'icon': Icons.phone_android, 'title': 'Social Media Vetting', 'desc': 'We vet your social media beforehand to ensure compliance.'},
      ]
    },
    'UK': {
      'intro': 'We offer assistance with the Tier 4 (Student), Tourist, and Business Visitor visa applications. We offer end-to-end assistance till you get your UK visa in your hands.',
      'highlightTitle': 'Point-Based Immigration System',
      'highlightDesc': 'Get support for meeting the minimum points threshold required for your UK Visa.',
      'features': [
        {'icon': Icons.description_outlined, 'title': 'Visa Documentation', 'desc': 'Ensure correctness in the Visa Application Form while minimizing chances of rejections.'},
        {'icon': Icons.attach_money, 'title': 'Financial Documentation', 'desc': 'Prove the right amount of finances needed to get your visa.'},
        {'icon': Icons.theater_comedy_outlined, 'title': 'Mock Interviews', 'desc': 'Get tailored training for your case on tackling the visa interview with confidence.'},
        {'icon': Icons.phone_android, 'title': 'Social Media Vetting', 'desc': 'We vet your social media beforehand to ensure compliance.'},
      ]
    }
  };

  @override
  Widget build(BuildContext context) {
    final currentContent = _content[_activeCountry]!;
    
    return Scaffold(
      appBar: AppBar(
        title: const Text('Visa Application Help'),
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
              tag: 'Expert Support',
              title: 'Visa Application\n',
              highlightTitle: 'Help',
              subtitle: 'Ace the visa application through our help in the paperwork, financial planning, and visa Interview mock rounds.',
              ctaText: 'Begin Expert Consult',
              onCtaPressed: () => showBookCounsellingSheet(context),
            ),
            
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'About Service',
                    style: Theme.of(context).textTheme.headlineMedium,
                  ),
                  const SizedBox(height: 8),
                  Container(
                    width: 60,
                    height: 4,
                    decoration: BoxDecoration(
                      color: AppTheme.gold,
                      borderRadius: BorderRadius.circular(2),
                    ),
                  ),
                  const SizedBox(height: 24),
                  
                  // Tabs
                  Container(
                    padding: const EdgeInsets.all(4),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      border: Border.all(color: AppTheme.gold.withValues(alpha: 0.2)),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Row(
                      children: _countries.map((c) {
                        final isSelected = _activeCountry == c;
                        return Expanded(
                          child: GestureDetector(
                            onTap: () => setState(() => _activeCountry = c),
                            child: AnimatedContainer(
                              duration: const Duration(milliseconds: 200),
                              padding: const EdgeInsets.symmetric(vertical: 12),
                              decoration: BoxDecoration(
                                color: isSelected ? AppTheme.gold : Colors.transparent,
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Text(
                                '${_flags[c]} $c',
                                textAlign: TextAlign.center,
                                style: TextStyle(
                                  fontWeight: FontWeight.bold,
                                  color: isSelected ? Colors.white : AppTheme.textMuted,
                                ),
                              ),
                            ),
                          ),
                        );
                      }).toList(),
                    ),
                  ),
                  
                  const SizedBox(height: 32),
                  
                  if (currentContent.containsKey('intro')) ...[
                    Text(
                      currentContent['intro'],
                      style: Theme.of(context).textTheme.bodyLarge?.copyWith(height: 1.5),
                    ),
                    const SizedBox(height: 24),
                  ],
                  
                  // Highlight card
                  Container(
                    padding: EdgeInsets.all(AppSpacing.md),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      border: Border.all(color: AppTheme.gold.withValues(alpha: 0.2)),
                      borderRadius: BorderRadius.circular(24),
                      boxShadow: [
                        BoxShadow(
                          color: AppTheme.gold.withValues(alpha: 0.05),
                          blurRadius: 10,
                          offset: const Offset(0, 5),
                        ),
                      ],
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            const Icon(Icons.star, color: AppTheme.gold),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Text(
                                currentContent['highlightTitle'],
                                style: Theme.of(context).textTheme.titleLarge,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 12),
                        Text(
                          currentContent['highlightDesc'],
                          style: Theme.of(context).textTheme.bodyMedium?.copyWith(height: 1.5),
                        ),
                      ],
                    ),
                  ),
                  
                  const SizedBox(height: 32),
                  
                  // Feature grid
                  ...(currentContent['features'] as List).map((feat) {
                    return Padding(
                      padding: const EdgeInsets.only(bottom: 16),
                      child: Container(
                        padding: const EdgeInsets.all(20),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          border: Border.all(color: AppTheme.gold.withValues(alpha: 0.15)),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Container(
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(
                                color: AppTheme.background,
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(color: AppTheme.gold.withValues(alpha: 0.2)),
                              ),
                              child: Icon(feat['icon'], color: AppTheme.gold, size: 24),
                            ),
                            const SizedBox(width: 16),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    feat['title'],
                                    style: Theme.of(context).textTheme.titleMedium,
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    feat['desc'],
                                    style: Theme.of(context).textTheme.bodySmall?.copyWith(height: 1.4),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  }),
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
}
