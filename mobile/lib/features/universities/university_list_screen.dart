import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:country_flags/country_flags.dart';
import '../../core/theme.dart';
import '../../data/university_repository.dart';

class UniversityListScreen extends StatefulWidget {
  final String country;
  const UniversityListScreen({super.key, required this.country});

  @override
  State<UniversityListScreen> createState() => _UniversityListScreenState();
}

class _UniversityListScreenState extends State<UniversityListScreen> {
  final TextEditingController _searchCtrl = TextEditingController();
  String _searchQuery = '';
  late Future<UniversityCountry?> _countryFuture;

  @override
  void initState() {
    super.initState();
    _countryFuture = UniversityRepository.getCountryBySlug(widget.country);
  }

  @override
  void didUpdateWidget(covariant UniversityListScreen oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.country != widget.country) {
      _countryFuture = UniversityRepository.getCountryBySlug(widget.country);
    }
  }

  @override
  void dispose() {
    _searchCtrl.dispose();
    super.dispose();
  }

  String _countryCode(String code) {
    return code;
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<UniversityCountry?>(
      future: _countryFuture,
      builder: (context, snapshot) {
        if (snapshot.connectionState != ConnectionState.done) {
          return const Scaffold(
            body: Center(child: CircularProgressIndicator()),
          );
        }

        final country = snapshot.data;
        if (country == null) {
          return Scaffold(
            backgroundColor: AppTheme.background,
            appBar: AppBar(backgroundColor: AppTheme.darkBrown, title: const Text('Universities')),
            body: const Center(child: Text('No university data available for this country.')),
          );
        }

        final universities = country.universities
            .where((u) => _searchQuery.isEmpty || u.name.toLowerCase().contains(_searchQuery.toLowerCase()))
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
                          child: CountryFlag.fromCountryCode(_countryCode(country.code), height: 50, width: 75),
                        ),
                        const SizedBox(width: 16),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text('Study in ${country.name}',
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
                      hintText: 'Search universities...'.toUpperCase(),
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
                        onTap: () => context.go('/university/${u.slug}'),
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
                                        Text(u.name,
                                            style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: AppTheme.textPrimary, height: 1.2)),
                                        const SizedBox(height: 6),
                                        Container(
                                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                          decoration: BoxDecoration(
                                            color: AppTheme.gold.withOpacity(0.1),
                                            borderRadius: BorderRadius.circular(20),
                                          ),
                                          child: Text(u.rank,
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
                                  _chip(Icons.school_rounded, u.programs),
                                  const SizedBox(width: 8),
                                  _chip(Icons.attach_money_rounded, u.fee),
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
      },
    );
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
