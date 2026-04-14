import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../core/theme.dart';

class ResourcesScreen extends StatelessWidget {
  const ResourcesScreen({super.key});

  final List<Map<String, String>> _resources = const [
    {'title': 'GRE Prep Guide 2026', 'type': 'PDF Guide', 'icon': '📘', 'tag': 'Test Prep'},
    {'title': 'TOEFL Complete Handbook', 'type': 'PDF Guide', 'icon': '📗', 'tag': 'Test Prep'},
    {'title': 'IELTS Band 9 Strategies', 'type': 'eBook', 'icon': '📙', 'tag': 'Test Prep'},
    {'title': 'USA Application Checklist', 'type': 'Checklist', 'icon': '✅', 'tag': 'Admissions'},
    {'title': 'SOP Writing Template', 'type': 'Template', 'icon': '📝', 'tag': 'Documents'},
    {'title': 'Scholarship Database 2026', 'type': 'Spreadsheet', 'icon': '💰', 'tag': 'Scholarships'},
    {'title': 'F1 Visa Interview Q&A', 'type': 'PDF Guide', 'icon': '✈️', 'tag': 'Visa'},
    {'title': 'LOR Request Email Templates', 'type': 'Templates', 'icon': '📧', 'tag': 'Documents'},
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(title: const Text('Resources'), backgroundColor: AppTheme.background),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: AppTheme.darkBrown,
              borderRadius: BorderRadius.circular(24),
            ),
            child: const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('📚', style: TextStyle(fontSize: 40)),
                SizedBox(height: 12),
                Text('Free Study Abroad\nResources',
                    style: TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.w900, height: 1.2)),
                SizedBox(height: 8),
                Text('Guides, templates & checklists',
                    style: TextStyle(color: Colors.white54, fontSize: 13)),
              ],
            ),
          ).animate().fadeIn(duration: 400.ms),

          const SizedBox(height: 20),

          ...List.generate(_resources.length, (i) {
            final r = _resources[i];
            return Container(
              margin: const EdgeInsets.only(bottom: 10),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppTheme.borderLight),
              ),
              child: Row(
                children: [
                  Container(
                    width: 48, height: 48,
                    decoration: BoxDecoration(
                      color: AppTheme.gold.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Center(child: Text(r['icon']!, style: const TextStyle(fontSize: 22))),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(r['title']!,
                            style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: AppTheme.textPrimary)),
                        const SizedBox(height: 4),
                        Row(children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                            decoration: BoxDecoration(
                              color: AppTheme.gold.withOpacity(0.1),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(r['tag']!, style: const TextStyle(fontSize: 9, fontWeight: FontWeight.w800, color: AppTheme.gold)),
                          ),
                          const SizedBox(width: 6),
                          Text(r['type']!, style: const TextStyle(fontSize: 10, color: AppTheme.textSecondary)),
                        ]),
                      ],
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: AppTheme.gold.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: const Icon(Icons.download_rounded, size: 18, color: AppTheme.gold),
                  ),
                ],
              ),
            ).animate().fadeIn(delay: Duration(milliseconds: i * 50));
          }),

          const SizedBox(height: 24),
        ],
      ),
    );
  }
}
