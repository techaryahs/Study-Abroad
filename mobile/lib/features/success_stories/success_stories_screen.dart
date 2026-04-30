import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../core/theme.dart';

class SuccessStoriesScreen extends StatelessWidget {
  const SuccessStoriesScreen({super.key});

  final List<Map<String, String>> _stories = const [
    {'name': 'Arjun Sharma', 'from': 'IIT Delhi → Stanford MS', 'country': '🇺🇸', 'scholarship': '₹45 Lakh', 'year': '2025', 'field': 'Computer Science'},
    {'name': 'Priya Menon', 'from': 'BITS Pilani → Harvard MBA', 'country': '🇺🇸', 'scholarship': '₹1.2 Cr', 'year': '2025', 'field': 'Business'},
    {'name': 'Ravi Patel', 'from': 'NIT → TU Munich MS', 'country': '🇩🇪', 'scholarship': 'Full Funding', 'year': '2024', 'field': 'Mechanical Engg'},
    {'name': 'Sneha Gupta', 'from': 'DU → Oxford MSc', 'country': '🇬🇧', 'scholarship': '£20,000', 'year': '2024', 'field': 'Economics'},
    {'name': 'Karan Das', 'from': 'XLRI → Melbourne MBA', 'country': '🇦🇺', 'scholarship': 'A\$30,000', 'year': '2024', 'field': 'Management'},
    {'name': 'Ayesha Khan', 'from': 'AMU → UCD MSc', 'country': '🇮🇪', 'scholarship': '€8,000', 'year': '2025', 'field': 'Biotechnology'},
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(title: const Text('Success Stories'), backgroundColor: AppTheme.background),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: AppTheme.darkBrown,
              borderRadius: BorderRadius.circular(24),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('🏆', style: TextStyle(fontSize: 40)),
                const SizedBox(height: 12),
                const Text('1000+ Dreams\nRealized',
                    style: TextStyle(color: Colors.white, fontSize: 26, fontWeight: FontWeight.w900, height: 1.2)),
                const SizedBox(height: 8),
                Text('Real students, real results.', style: TextStyle(color: Colors.white.withOpacity(0.5), fontSize: 13)),
              ],
            ),
          ).animate().fadeIn(duration: 400.ms),

          const SizedBox(height: 20),

          ...List.generate(_stories.length, (i) {
            final s = _stories[i];
            return Container(
              margin: const EdgeInsets.only(bottom: 14),
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: AppTheme.borderLight),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        width: 48, height: 48,
                        decoration: BoxDecoration(
                          color: AppTheme.gold.withOpacity(0.1),
                          shape: BoxShape.circle,
                        ),
                        child: Center(
                          child: Text(
                            s['name']!.split(' ').map((w) => w[0]).join(),
                            style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: AppTheme.gold),
                          ),
                        ),
                      ),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(s['name']!,
                                style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: AppTheme.textPrimary)),
                            Text('${s['country']} ${s['from']}',
                                style: const TextStyle(fontSize: 13, color: AppTheme.textSecondary)),
                          ],
                        ),
                      ),
                      Text(s['year']!,
                          style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: AppTheme.textSecondary)),
                    ],
                  ),
                  const SizedBox(height: 14),
                  Row(
                    children: [
                      _chip('🎓', s['field']!),
                      const SizedBox(width: 8),
                      _chip('💰', s['scholarship']!),
                    ],
                  ),
                ],
              ),
            ).animate().fadeIn(delay: Duration(milliseconds: i * 70)).slideY(begin: 0.05);
          }),
        ],
      ),
    );
  }

  Widget _chip(String emoji, String text) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
      decoration: BoxDecoration(
        color: AppTheme.gold.withOpacity(0.08),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppTheme.gold.withOpacity(0.2)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(emoji, style: const TextStyle(fontSize: 13)),
          const SizedBox(width: 4),
          Text(text, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: AppTheme.gold)),
        ],
      ),
    );
  }
}
