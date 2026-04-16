import 'package:flutter/material.dart';
import '../../core/theme.dart';

class UniversityDetailScreen extends StatelessWidget {
  final String slug;
  const UniversityDetailScreen({super.key, required this.slug});

  static final Map<String, Map<String, dynamic>> _universityDetails = {
    'harvard-university': {
      'name': 'Harvard University',
      'location': 'Cambridge, Massachusetts, United States',
      'type': 'Private University',
      'students': '20,593',
      'internationalStudents': '5,355',
      'rank': '#4 QS World',
      'programs': 'MBA, Law, Medicine',
      'about': 'Harvard University is a world-leading research institution known for a rigorous academic environment, prestigious faculty, and a strong global network.',
      'highlights': [
        'Established in 1636',
        'Ivy League leader',
        'Top-ranked law and business schools',
        'Comprehensive research funding',
      ],
    },
    'stanford-university': {
      'name': 'Stanford University',
      'location': 'Stanford, California, United States',
      'type': 'Private University',
      'students': '17,000+',
      'internationalStudents': '4,700+',
      'rank': '#3 QS World',
      'programs': 'MS, PhD, MBA',
      'about': 'Stanford blends innovation, entrepreneurship, and academic excellence across engineering, business, and the arts.',
      'highlights': [
        'Silicon Valley ecosystem',
        'Entrepreneurship support',
        'Strong research partnerships',
        'Leadership in technology',
      ],
    },
  };

  @override
  Widget build(BuildContext context) {
    final details = _universityDetails[slug];
    if (details == null) {
      return Scaffold(
        appBar: AppBar(
          title: const Text('University Details'),
          backgroundColor: AppTheme.darkBrown,
        ),
        body: const Center(
          child: Text('University not found', style: TextStyle(fontSize: 16)),
        ),
      );
    }

    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        backgroundColor: AppTheme.darkBrown,
        title: Text(details['name'] as String),
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: AppTheme.darkBrown,
                borderRadius: const BorderRadius.only(
                  bottomLeft: Radius.circular(30),
                  bottomRight: Radius.circular(30),
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const SizedBox(height: 16),
                  Text(details['name'] as String,
                      style: const TextStyle(color: Colors.white, fontSize: 28, fontWeight: FontWeight.w900, height: 1.1)),
                  const SizedBox(height: 12),
                  Text(details['location'] as String,
                      style: const TextStyle(color: Colors.white70, fontSize: 13, height: 1.6)),
                  const SizedBox(height: 20),
                  Wrap(
                    spacing: 10,
                    runSpacing: 10,
                    children: [
                      _badge(details['rank'] as String),
                      _badge(details['type'] as String),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _detailTile('Programs', details['programs'] as String),
                  const SizedBox(height: 12),
                  _detailTile('Total Students', details['students'] as String),
                  const SizedBox(height: 12),
                  _detailTile('International Students', details['internationalStudents'] as String),
                  const SizedBox(height: 24),
                  const Text('About', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: AppTheme.textPrimary)),
                  const SizedBox(height: 10),
                  Text(details['about'] as String, style: const TextStyle(fontSize: 14, color: AppTheme.textSecondary, height: 1.6)),
                  const SizedBox(height: 24),
                  const Text('Highlights', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: AppTheme.textPrimary)),
                  const SizedBox(height: 12),
                  ...List<Widget>.from((details['highlights'] as List<String>).map((feature) => Padding(
                        padding: const EdgeInsets.only(bottom: 10),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text('• ', style: TextStyle(fontSize: 18, color: AppTheme.gold)),
                            Expanded(child: Text(feature, style: const TextStyle(fontSize: 14, color: AppTheme.textSecondary, height: 1.6))),
                          ],
                        ),
                      ))),
                  const SizedBox(height: 30),
                  SizedBox(
                    width: double.infinity,
                    height: 56,
                    child: ElevatedButton(
                      onPressed: () {},
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.gold,
                        foregroundColor: AppTheme.darkBrown,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      ),
                      child: const Text('Apply for Guidance', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w900)),
                    ),
                  ),
                  const SizedBox(height: 30),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _badge(String text) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: AppTheme.gold.withOpacity(0.15),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Text(text, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w800, color: AppTheme.gold)),
    );
  }

  Widget _detailTile(String label, String value) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: AppTheme.borderLight),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w900, color: AppTheme.textSecondary)),
          const SizedBox(height: 8),
          Text(value, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w700, color: AppTheme.textPrimary)),
        ],
      ),
    );
  }
}
