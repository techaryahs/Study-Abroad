import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme.dart';
import '../../data/university_repository.dart';

class UniversityCountriesScreen extends StatelessWidget {
  const UniversityCountriesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        backgroundColor: AppTheme.background,
        elevation: 0,
        title: const Text('Countries & Slugs',
            style: TextStyle(
                color: AppTheme.textPrimary,
                fontWeight: FontWeight.w900,
                fontSize: 20)),
        iconTheme: const IconThemeData(color: AppTheme.textPrimary),
      ),
      body: FutureBuilder<List<UniversityCountry>>(
        future: UniversityRepository.getAllCountries(),
        builder: (context, snapshot) {
          if (snapshot.connectionState != ConnectionState.done) {
            return const Center(child: CircularProgressIndicator());
          }

          final countries = snapshot.data ?? [];
          if (countries.isEmpty) {
            return const Center(
                child: Text('No countries available.',
                    style: TextStyle(color: AppTheme.textSecondary)));
          }

          return SafeArea(
            child: ListView.separated(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              physics: const BouncingScrollPhysics(),
              itemCount: countries.length,
              separatorBuilder: (_, __) => const SizedBox(height: 14),
              itemBuilder: (context, index) {
                final country = countries[index];
                return Material(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(20),
                  child: InkWell(
                    borderRadius: BorderRadius.circular(20),
                    onTap: () => context.push('/universities/${country.slug}'),
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 18, vertical: 18),
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
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(country.name,
                                        style: const TextStyle(
                                            fontSize: 16,
                                            fontWeight: FontWeight.w900,
                                            color: AppTheme.textPrimary)),
                                    const SizedBox(height: 6),
                                    Text('Slug: ${country.slug}',
                                        style: const TextStyle(
                                            fontSize: 13,
                                            color: AppTheme.textSecondary)),
                                  ],
                                ),
                              ),
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.end,
                                children: [
                                  Text('${country.universities.length}',
                                      style: const TextStyle(
                                          fontSize: 24,
                                          fontWeight: FontWeight.w900,
                                          color: AppTheme.gold)),
                                  const SizedBox(height: 4),
                                  const Text('Universities',
                                      style: TextStyle(
                                          fontSize: 13,
                                          color: AppTheme.textSecondary)),
                                ],
                              ),
                            ],
                          ),
                          const SizedBox(height: 16),
                          Wrap(
                            spacing: 8,
                            runSpacing: 8,
                            children: country.universities
                                .map((university) => Container(
                                      padding: const EdgeInsets.symmetric(
                                          horizontal: 10, vertical: 6),
                                      decoration: BoxDecoration(
                                        color: AppTheme.backgroundAlt,
                                        borderRadius: BorderRadius.circular(14),
                                      ),
                                      child: Text(university.slug,
                                          style: const TextStyle(
                                              fontSize: 13,
                                              color: AppTheme.textSecondary,
                                              fontWeight: FontWeight.w700)),
                                    ))
                                .toList(),
                          ),
                          const SizedBox(height: 10),
                          Row(
                            children: const [
                              Text('Tap to view country universities',
                                  style: TextStyle(
                                      fontSize: 13,
                                      color: AppTheme.textSecondary)),
                              Spacer(),
                              Icon(Icons.arrow_forward_ios_rounded,
                                  size: 14, color: AppTheme.textSecondary),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                );
              },
            ),
          );
        },
      ),
    );
  }
}
