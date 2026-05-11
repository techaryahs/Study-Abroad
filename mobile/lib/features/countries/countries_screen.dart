import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:country_flags/country_flags.dart';
import '../../core/theme.dart';

class CountriesScreen extends StatelessWidget {
  const CountriesScreen({super.key});

  final List<Map<String, dynamic>> _countries = const [
    {
      'name': 'USA',
      'slug': 'usa',
      'code': 'US',
      'universities': '4500+',
      'description': 'Home to Ivy League & Top-ranked institutions',
      'scholarships': '₹2Cr Max',
      'visa': 'F1 Visa',
      'color': 0xFF1B3F8B,
    },
    {
      'name': 'UK',
      'slug': 'united-kingdom',
      'code': 'GB',
      'universities': '160+',
      'description': 'Russell Group & prestigious academic heritage',
      'scholarships': 'Merit Awards',
      'visa': 'Student Visa',
      'color': 0xFF912338,
    },
    {
      'name': 'Germany',
      'slug': 'germany',
      'code': 'DE',
      'universities': '400+',
      'description': 'Free tuition public universities & research excellence',
      'scholarships': 'Full Funding',
      'visa': 'Student Visa',
      'color': 0xFF1A1A1A,
    },
    {
      'name': 'Australia',
      'slug': 'australia',
      'code': 'AU',
      'universities': '43+',
      'description': 'Group of Eight & world-class research focus',
      'scholarships': '50% Fee Waiver',
      'visa': 'Subclass 500',
      'color': 0xFF003087,
    },
    {
      'name': 'Ireland',
      'slug': 'ireland',
      'code': 'IE',
      'universities': '30+',
      'description': 'Gateway to Europe with English-taught programs',
      'scholarships': 'Government Grants',
      'visa': 'Study Visa',
      'color': 0xFF169B62,
    },
    {
      'name': 'Canada',
      'slug': 'canada',
      'code': 'CA',
      'universities': '100+',
      'description': 'Post-study work rights & welcoming immigration',
      'scholarships': 'Provincial Aid',
      'visa': 'Study Permit',
      'color': 0xFFFF0000,
    },
    {
      'name': 'Dubai',
      'slug': 'dubai',
      'code': 'AE',
      'universities': '70+',
      'description': 'Global education hub with tax-free lifestyle',
      'scholarships': 'Merit-Based',
      'visa': 'Student Visa',
      'color': 0xFF00732F,
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        title: const Text('Study Destinations'),
        backgroundColor: AppTheme.background,
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Header
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: AppTheme.darkBrown,
              borderRadius: BorderRadius.circular(24),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Explore\nTop Countries',
                    style: TextStyle(
                        color: Colors.white,
                        fontSize: 26,
                        fontWeight: FontWeight.w900,
                        height: 1.2)),
                const SizedBox(height: 8),
                Text('15+ countries, 360+ partner universities',
                    style: TextStyle(
                        color: Colors.white.withOpacity(0.5), fontSize: 14)),
              ],
            ),
          ).animate().fadeIn(duration: 400.ms),

          const SizedBox(height: 20),

          ...List.generate(_countries.length, (i) {
            final c = _countries[i];
            return GestureDetector(
              onTap: () => context.push('/universities/${c['slug']}'),
              child: Container(
                margin: const EdgeInsets.only(bottom: 14),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: AppTheme.borderLight),
                ),
                child: Column(
                  children: [
                    // Country Header
                    Container(
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        color: Color(c['color'] as int).withOpacity(0.06),
                        borderRadius: const BorderRadius.vertical(
                            top: Radius.circular(20)),
                      ),
                      child: Row(
                        children: [
                          ClipRRect(
                            borderRadius: BorderRadius.circular(10),
                            child: CountryFlag.fromCountryCode(
                              c['code'] as String,
                              height: 44,
                              width: 66,
                            ),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(c['name'] as String,
                                    style: const TextStyle(
                                        fontSize: 20,
                                        fontWeight: FontWeight.w900,
                                        color: AppTheme.textPrimary)),
                                const SizedBox(height: 4),
                                Text(c['description'] as String,
                                    style: const TextStyle(
                                        fontSize: 13,
                                        color: AppTheme.textSecondary,
                                        height: 1.4)),
                              ],
                            ),
                          ),
                          const Icon(Icons.arrow_forward_ios_rounded,
                              size: 14, color: AppTheme.textSecondary),
                        ],
                      ),
                    ),

                    // Stats row
                    Padding(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 20, vertical: 14),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceAround,
                        children: [
                          _statChip('🏛️', c['universities'] as String,
                              'Universities'),
                          _divider(),
                          _statChip(
                              '🎓', c['scholarships'] as String, 'Scholarship'),
                          _divider(),
                          _statChip('✈️', c['visa'] as String, 'Visa Type'),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            )
                .animate()
                .fadeIn(delay: Duration(milliseconds: i * 70))
                .slideY(begin: 0.05);
          }),
        ],
      ),
    );
  }

  Widget _statChip(String icon, String value, String label) {
    return Column(
      children: [
        Text(icon, style: const TextStyle(fontSize: 16)),
        const SizedBox(height: 4),
        Text(value,
            style: const TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w900,
                color: AppTheme.textPrimary)),
        Text(label,
            style: const TextStyle(
                fontSize: 14,
                color: AppTheme.textSecondary,
                fontWeight: FontWeight.w600)),
      ],
    );
  }

  Widget _divider() {
    return Container(width: 1, height: 32, color: AppTheme.borderLight);
  }
}
