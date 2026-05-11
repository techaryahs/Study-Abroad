import 'package:flutter/material.dart';
import '../../core/theme.dart';

class HighRankedCheapUniversitiesScreen extends StatelessWidget {
  const HighRankedCheapUniversitiesScreen({super.key});

  static final List<Map<String, dynamic>> _universities = [
    {
      'name': 'University of Zurich',
      'country': 'Switzerland',
      'rank': '#20',
      'tuition': '~CHF 2,900/year',
      'icon': '🏛',
    },
    {
      'name': 'KTH Royal Institute of Technology',
      'country': 'Sweden',
      'rank': '#45',
      'tuition': '~Free',
      'icon': '🔬',
    },
    {
      'name': 'LMU Munich',
      'country': 'Germany',
      'rank': '#32',
      'tuition': '~€0-500/semester',
      'icon': '🎓',
    },
    {
      'name': 'University of Oslo',
      'country': 'Norway',
      'rank': '#68',
      'tuition': '~Free',
      'icon': '📚',
    },
    {
      'name': 'University of Copenhagen',
      'country': 'Denmark',
      'rank': '#38',
      'tuition': '~DKK 46,000/year',
      'icon': '🏛',
    },
    {
      'name': 'Trinity College Dublin',
      'country': 'Ireland',
      'rank': '#42',
      'tuition': '~€9,000/year',
      'icon': '👨‍🎓',
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        backgroundColor: AppTheme.background,
        elevation: 0,
        title: const Text('High Ranked, Low Tuition', style: TextStyle(color: AppTheme.textPrimary, fontWeight: FontWeight.w900, fontSize: 20)),
        iconTheme: const IconThemeData(color: AppTheme.textPrimary),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Top-quality education without breaking the bank.',
                style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: AppTheme.textSecondary, height: 1.6),
              ),
              const SizedBox(height: 20),
              Expanded(
                child: ListView.separated(
                  physics: const BouncingScrollPhysics(),
                  itemCount: _universities.length,
                  separatorBuilder: (_, __) => const SizedBox(height: 12),
                  itemBuilder: (context, index) {
                    final uni = _universities[index];
                    return _universityCard(uni);
                  },
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _universityCard(Map<String, dynamic> uni) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppTheme.borderLight),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.03),
            blurRadius: 14,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                width: 50,
                height: 50,
                decoration: BoxDecoration(
                  color: AppTheme.gold.withOpacity(0.12),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Center(
                  child: Text(uni['icon'] as String, style: const TextStyle(fontSize: 26)),
                ),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      uni['name'] as String,
                      style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w900, color: AppTheme.textPrimary),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 4),
                    Text(
                      uni['country'] as String,
                      style: const TextStyle(fontSize: 14, color: AppTheme.textSecondary),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                decoration: BoxDecoration(
                  color: AppTheme.gold.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  uni['rank'] as String,
                  style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w900, color: AppTheme.gold),
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            decoration: BoxDecoration(
              color: AppTheme.background,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: AppTheme.borderLight),
            ),
            child: Row(
              children: [
                const Icon(Icons.attach_money_rounded, size: 14, color: AppTheme.gold),
                const SizedBox(width: 6),
                Text(
                  uni['tuition'] as String,
                  style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: AppTheme.textPrimary),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
