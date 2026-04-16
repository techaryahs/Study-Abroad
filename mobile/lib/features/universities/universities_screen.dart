import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme.dart';

class UniversitiesScreen extends StatelessWidget {
  const UniversitiesScreen({super.key});

  static final List<Map<String, dynamic>> _items = [
    {
      'title': 'Top Universities By Country',
      'subtitle': 'Find statistics like acceptance rates, expenses, deadlines, and test scores.',
      'icon': Icons.public_rounded,
      'badge': null,
    },
    {
      'title': 'UniPredict',
      'subtitle': 'Predicts where you can get admits.',
      'icon': Icons.bar_chart_rounded,
      'badge': null,
    },
    {
      'title': 'RateMyChances',
      'subtitle': 'Estimates your admit chances based on your profile.',
      'icon': Icons.percent_rounded,
      'badge': 'NEW',
    },
    {
      'title': 'Popular Programs',
      'subtitle': 'Explore the most sought-after academic programs worldwide.',
      'icon': Icons.menu_book_rounded,
      'badge': null,
    },
    {
      'title': 'High Ranked Cheap Universities',
      'subtitle': 'Top-quality education without breaking the bank.',
      'icon': Icons.attach_money_rounded,
      'badge': null,
    },
    {
      'title': 'Top Universities by State',
      'subtitle': 'Filter top schools by region (California, Texas, Ontario, etc.).',
      'icon': Icons.location_on_rounded,
      'badge': null,
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        backgroundColor: AppTheme.background,
        elevation: 0,
        title: const Text(
          'Top Global Universities',
          style: TextStyle(
            color: AppTheme.textPrimary,
            fontWeight: FontWeight.w900,
            fontSize: 20,
          ),
        ),
        iconTheme: const IconThemeData(color: AppTheme.textPrimary),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Discover curated pathways and insights for top global universities in a clean light layout.',
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                  color: AppTheme.textSecondary,
                  height: 1.6,
                ),
              ),
              const SizedBox(height: 24),
              Expanded(
                child: ListView.separated(
                  physics: const BouncingScrollPhysics(),
                  itemCount: _items.length,
                  separatorBuilder: (_, __) => const SizedBox(height: 14),
                  itemBuilder: (context, index) {
                    final item = _items[index];

                    return GestureDetector(
                      onTap: () {
                        if (index == 0) {
                          context.go('/universities/countries');
                        } else if (index == 1) {
                          context.go('/universities/unipredict');
                        } else if (index == 2) {
                          context.go('/universities/rate-my-chances');
                        } else if (index == 3) {
                          context.go('/universities/popular-programs');
                        } else if (index == 4) {
                          context.go('/universities/high-ranked-cheap');
                        } else if (index == 5) {
                          context.go('/universities/by-state');
                        }
                      },
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 18),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: AppTheme.borderLight),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.03),
                              blurRadius: 18,
                              offset: const Offset(0, 4),
                            ),
                          ],
                        ),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Container(
                              width: 50,
                              height: 50,
                              decoration: BoxDecoration(
                                color: AppTheme.gold.withOpacity(0.12),
                                borderRadius: BorderRadius.circular(16),
                              ),
                              child: Icon(
                                item['icon'] as IconData,
                                color: AppTheme.gold,
                                size: 26,
                              ),
                            ),
                            const SizedBox(width: 16),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    crossAxisAlignment: CrossAxisAlignment.center,
                                    children: [
                                      Expanded(
                                        child: Text(
                                          item['title'] as String,
                                          style: const TextStyle(
                                            fontSize: 16,
                                            fontWeight: FontWeight.w900,
                                            color: AppTheme.textPrimary,
                                          ),
                                        ),
                                      ),
                                      if (item['badge'] != null)
                                        Container(
                                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                          decoration: BoxDecoration(
                                            color: AppTheme.gold,
                                            borderRadius: BorderRadius.circular(12),
                                          ),
                                          child: Text(
                                            item['badge'] as String,
                                            style: const TextStyle(
                                              fontSize: 10,
                                              fontWeight: FontWeight.w900,
                                              color: AppTheme.darkBrown,
                                            ),
                                          ),
                                        ),
                                    ],
                                  ),
                                  const SizedBox(height: 8),
                                  Text(
                                    item['subtitle'] as String,
                                    style: const TextStyle(
                                      fontSize: 13,
                                      color: AppTheme.textSecondary,
                                      height: 1.5,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            const SizedBox(width: 12),
                            const Icon(
                              Icons.arrow_forward_ios_rounded,
                              size: 16,
                              color: AppTheme.textSecondary,
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}