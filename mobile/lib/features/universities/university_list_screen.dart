import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:country_flags/country_flags.dart';
import '../../core/theme.dart';

class UniversityListScreen extends StatefulWidget {
  final String country;
  const UniversityListScreen({super.key, required this.country});

  @override
  State<UniversityListScreen> createState() => _UniversityListScreenState();
}

class _UniversityListScreenState extends State<UniversityListScreen> {
  final TextEditingController _searchCtrl = TextEditingController();
  String _searchQuery = '';

  final Map<String, List<Map<String, dynamic>>> _universitiesByCountry = {
    'USA': [
      {'name': 'Massachusetts Institute of Technology', 'rank': '#1 QS World', 'programs': 'MS, PhD, MBA', 'fee': '\$55,000/yr'},
      {'name': 'Stanford University', 'rank': '#3 QS World', 'programs': 'MS, PhD, MBA', 'fee': '\$58,000/yr'},
      {'name': 'Harvard University', 'rank': '#4 QS World', 'programs': 'MBA, Law, Medicine', 'fee': '\$53,000/yr'},
      {'name': 'Carnegie Mellon University', 'rank': '#52 QS World', 'programs': 'MS CS, Robotics', 'fee': '\$60,000/yr'},
      {'name': 'University of California Berkeley', 'rank': '#10 QS World', 'programs': 'MS, PhD', 'fee': '\$44,000/yr'},
      {'name': 'Cornell University', 'rank': '#20 QS World', 'programs': 'MBA, MS, PhD', 'fee': '\$62,000/yr'},
    ],
    'UK': [
      {'name': 'University of Oxford', 'rank': '#1 UK', 'programs': 'MBA, Law, MSc', 'fee': '£30,000/yr'},
      {'name': 'University of Cambridge', 'rank': '#2 UK', 'programs': 'MSc, PhD, MBA', 'fee': '£28,000/yr'},
      {'name': 'Imperial College London', 'rank': '#6 QS', 'programs': 'MSc Engineering', 'fee': '£35,000/yr'},
      {'name': 'London School of Economics', 'rank': 'Top 50 QS', 'programs': 'MSc Economics', 'fee': '£28,000/yr'},
    ],
    'Germany': [
      {'name': 'Technical University of Munich', 'rank': '#37 QS World', 'programs': 'MS, PhD', 'fee': '€0–350/sem'},
      {'name': 'RWTH Aachen University', 'rank': '#106 QS', 'programs': 'MS Engineering', 'fee': '€0–300/sem'},
      {'name': 'Heidelberg University', 'rank': '#87 QS', 'programs': 'MS, PhD', 'fee': '€0–300/sem'},
    ],
    'Australia': [
      {'name': 'University of Melbourne', 'rank': '#33 QS', 'programs': 'MS, MBA, PhD', 'fee': 'A\$40,000/yr'},
      {'name': 'Australian National University', 'rank': '#34 QS', 'programs': 'MS, PhD', 'fee': 'A\$42,000/yr'},
      {'name': 'University of Sydney', 'rank': '#41 QS', 'programs': 'MBA, MS', 'fee': 'A\$46,000/yr'},
    ],
    'Canada': [
      {'name': 'University of Toronto', 'rank': '#21 QS', 'programs': 'MS, MBA, PhD', 'fee': 'CA\$32,000/yr'},
      {'name': 'McGill University', 'rank': '#31 QS', 'programs': 'MS, MBA', 'fee': 'CA\$24,000/yr'},
      {'name': 'University of British Columbia', 'rank': '#46 QS', 'programs': 'MS, MBA', 'fee': 'CA\$38,000/yr'},
    ],
    'Ireland': [
      {'name': 'Trinity College Dublin', 'rank': '#81 QS', 'programs': 'MSc, MBA', 'fee': '€12,000/yr'},
      {'name': 'University College Dublin', 'rank': '#181 QS', 'programs': 'MSc, MBL', 'fee': '€14,000/yr'},
    ],
    'Dubai': [
      {'name': 'University of Dubai', 'rank': 'Top UAE', 'programs': 'MBA, MS', 'fee': 'AED 50,000/yr'},
      {'name': 'Heriot-Watt University Dubai', 'rank': 'UK Ranked', 'programs': 'MBA, MSc', 'fee': 'AED 65,000/yr'},
    ],
  };

  @override
  void dispose() {
    _searchCtrl.dispose();
    super.dispose();
  }

  String _countryCode() {
    const codes = {'USA': 'US', 'UK': 'GB', 'Germany': 'DE', 'Australia': 'AU', 'Ireland': 'IE', 'Canada': 'CA', 'Dubai': 'AE'};
    return codes[widget.country] ?? 'US';
  }

  @override
  Widget build(BuildContext context) {
    final universities = (_universitiesByCountry[widget.country] ?? [])
        .where((u) => _searchQuery.isEmpty || (u['name'] as String).toLowerCase().contains(_searchQuery.toLowerCase()))
        .toList();

    return Scaffold(
      backgroundColor: AppTheme.background,
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 160,
            pinned: true,
            backgroundColor: AppTheme.darkBrown,
            flexibleSpace: FlexibleSpaceBar(
              background: Container(
                color: AppTheme.darkBrown,
                padding: const EdgeInsets.fromLTRB(20, 80, 20, 20),
                child: Row(
                  children: [
                    ClipRRect(
                      borderRadius: BorderRadius.circular(12),
                      child: CountryFlag.fromCountryCode(_countryCode(), height: 50, width: 75),
                    ),
                    const SizedBox(width: 16),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text('Study in ${widget.country}',
                            style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.w900)),
                        Text('${universities.length} Universities',
                            style: TextStyle(color: Colors.white.withOpacity(0.5), fontSize: 12)),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ),

          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: TextField(
                controller: _searchCtrl,
                onChanged: (v) => setState(() => _searchQuery = v),
                style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600),
                decoration: InputDecoration(
                  hintText: 'Search universities...',
                  prefixIcon: const Icon(Icons.search_rounded, size: 20, color: AppTheme.textSecondary),
                  suffixIcon: _searchQuery.isNotEmpty
                      ? IconButton(
                          icon: const Icon(Icons.clear_rounded, size: 18),
                          onPressed: () { _searchCtrl.clear(); setState(() => _searchQuery = ''); },
                        )
                      : null,
                ),
              ),
            ),
          ),

          SliverPadding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            sliver: SliverList(
              delegate: SliverChildBuilderDelegate(
                (_, i) {
                  final u = universities[i];
                  return GestureDetector(
                    onTap: () => context.go('/university/${_slug(u['name'] as String)}'),
                    child: Container(
                      margin: const EdgeInsets.only(bottom: 12),
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
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Container(
                                width: 44, height: 44,
                                decoration: BoxDecoration(
                                  color: AppTheme.darkBrown,
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: const Center(
                                  child: Text('🏛', style: TextStyle(fontSize: 22)),
                                ),
                              ),
                              const SizedBox(width: 14),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(u['name'] as String,
                                        style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: AppTheme.textPrimary, height: 1.2)),
                                    const SizedBox(height: 6),
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                      decoration: BoxDecoration(
                                        color: AppTheme.gold.withOpacity(0.1),
                                        borderRadius: BorderRadius.circular(20),
                                      ),
                                      child: Text(u['rank'] as String,
                                          style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w700, color: AppTheme.gold)),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 14),
                          Row(
                            children: [
                              _chip(Icons.school_rounded, u['programs'] as String),
                              const SizedBox(width: 8),
                              _chip(Icons.attach_money_rounded, u['fee'] as String),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ).animate().fadeIn(delay: Duration(milliseconds: i * 50)).slideY(begin: 0.05);
                },
                childCount: universities.length,
              ),
            ),
          ),

          const SliverToBoxAdapter(child: SizedBox(height: 24)),
        ],
      ),
    );
  }

  String _slug(String text) {
    return text.toLowerCase().replaceAll(RegExp(r"[^a-z0-9]+"), '-').replaceAll(RegExp(r'-+'), '-').trim();
  }

  Widget _chip(IconData icon, String text) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
      decoration: BoxDecoration(
        color: AppTheme.background,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppTheme.borderLight),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 12, color: AppTheme.textSecondary),
          const SizedBox(width: 4),
          Text(text, style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w700, color: AppTheme.textSecondary)),
        ],
      ),
    );
  }
}
