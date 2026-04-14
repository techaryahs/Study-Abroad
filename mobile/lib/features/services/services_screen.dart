import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../core/theme.dart';
import '../../core/api_client.dart';
import '../../widgets/book_counselling_sheet.dart';

class ServicesScreen extends StatefulWidget {
  const ServicesScreen({super.key});
  @override
  State<ServicesScreen> createState() => _ServicesScreenState();
}

class _ServicesScreenState extends State<ServicesScreen> {
  final List<Map<String, dynamic>> _services = [
    {
      'title': 'Admission Guidance',
      'icon': '🏛️',
      'price': 4999,
      'description': 'Expert step-by-step application strategy for top global universities including Ivy League, Russell Group, and QS-ranked institutions.',
      'features': ['Document Review', 'Application Strategy', 'Timeline Planning', 'Expert Mentorship'],
    },
    {
      'title': 'University Shortlisting',
      'icon': '📋',
      'price': 2999,
      'description': 'AI-powered and expert-curated university shortlist tailored to your profile, budget, and career goals.',
      'features': ['Profile Matching', 'Ranking Analysis', 'Budget Fit', '15+ Options'],
    },
    {
      'title': 'SOP & LOR Support',
      'icon': '✍️',
      'price': 5999,
      'description': 'Premium Statement of Purpose and Letter of Recommendation crafting with unlimited revisions.',
      'features': ['SOP Writing', 'LOR Drafting', 'Unlimited Edits', 'Expert Review'],
    },
    {
      'title': 'Scholarship Assistance',
      'icon': '🎓',
      'price': 3999,
      'description': 'Find and apply for merit-based and need-based scholarships worth up to ₹2 Crore.',
      'features': ['Scholarship Search', 'Application Help', 'Essay Review', 'Interview Prep'],
    },
    {
      'title': 'Visa Guidance',
      'icon': '🛂',
      'price': 3499,
      'description': 'End-to-end student visa support for USA (F1), UK, Germany, Australia, Canada and more.',
      'features': ['Document Checklist', 'Form Filling', 'Interview Prep', 'Mock Sessions'],
    },
    {
      'title': 'Profile Building',
      'icon': '📈',
      'price': 6999,
      'description': 'Comprehensive profile enhancement including research, internships, extracurriculars, and test prep strategy.',
      'features': ['Gap Analysis', 'Activity Planning', 'Test Strategy', '12-Month Plan'],
    },
  ];

  final Set<int> _cart = {};

  void _toggleCart(int index) {
    setState(() {
      if (_cart.contains(index)) _cart.remove(index);
      else _cart.add(index);
    });
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(_cart.contains(index) ? '✓ Added to cart' : 'Removed from cart'),
        backgroundColor: _cart.contains(index) ? Colors.green.shade700 : AppTheme.textSecondary,
        behavior: SnackBarBehavior.floating,
        duration: const Duration(seconds: 1),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        title: const Text('Our Services'),
        backgroundColor: AppTheme.background,
        actions: [
          Stack(
            alignment: Alignment.center,
            children: [
              IconButton(
                icon: const Icon(Icons.shopping_cart_outlined),
                onPressed: () {},
              ),
              if (_cart.isNotEmpty)
                Positioned(
                  top: 8, right: 8,
                  child: Container(
                    width: 16, height: 16,
                    decoration: const BoxDecoration(color: AppTheme.gold, shape: BoxShape.circle),
                    child: Center(
                      child: Text('${_cart.length}',
                          style: const TextStyle(fontSize: 9, fontWeight: FontWeight.w800, color: AppTheme.darkBrown)),
                    ),
                  ),
                ),
            ],
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // ── HEADER BANNER ──────────────────────────────
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: AppTheme.darkBrown,
              borderRadius: BorderRadius.circular(24),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Premium Study\nAbroad Services',
                    style: TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.w900, height: 1.2)),
                const SizedBox(height: 8),
                Text('Trusted by 1000+ students worldwide',
                    style: TextStyle(color: Colors.white.withOpacity(0.5), fontSize: 12)),
                const SizedBox(height: 20),
                GestureDetector(
                  onTap: () => showBookCounsellingSheet(context),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                    decoration: BoxDecoration(
                      color: AppTheme.gold,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Text('Book Free Counselling',
                        style: TextStyle(color: AppTheme.darkBrown, fontSize: 13, fontWeight: FontWeight.w800)),
                  ),
                ),
              ],
            ),
          ).animate().fadeIn(duration: 400.ms),

          const SizedBox(height: 24),

          // ── SERVICES LIST ─────────────────────────────
          ...List.generate(_services.length, (i) {
            final s = _services[i];
            final inCart = _cart.contains(i);
            return Container(
              margin: const EdgeInsets.only(bottom: 16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(
                  color: inCart ? AppTheme.gold : AppTheme.borderLight,
                  width: inCart ? 1.5 : 1,
                ),
                boxShadow: inCart ? [
                  BoxShadow(color: AppTheme.gold.withOpacity(0.1), blurRadius: 12, offset: const Offset(0, 4))
                ] : [],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Padding(
                    padding: const EdgeInsets.all(20),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Container(
                              width: 48, height: 48,
                              decoration: BoxDecoration(
                                color: AppTheme.darkBrown,
                                borderRadius: BorderRadius.circular(14),
                              ),
                              child: Center(child: Text(s['icon'] as String, style: const TextStyle(fontSize: 22))),
                            ),
                            const SizedBox(width: 14),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(s['title'] as String,
                                      style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: AppTheme.textPrimary)),
                                  const SizedBox(height: 4),
                                  Text('₹${(s['price'] as int).toStringAsFixed(0)}',
                                      style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: AppTheme.gold)),
                                ],
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 14),
                        Text(s['description'] as String,
                            style: const TextStyle(fontSize: 12, color: AppTheme.textSecondary, height: 1.6)),
                        const SizedBox(height: 14),
                        Wrap(
                          spacing: 8, runSpacing: 8,
                          children: (s['features'] as List<String>).map((f) => Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                            decoration: BoxDecoration(
                              color: AppTheme.background,
                              borderRadius: BorderRadius.circular(20),
                              border: Border.all(color: AppTheme.borderLight),
                            ),
                            child: Text('✓ $f',
                                style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w600, color: AppTheme.textSecondary)),
                          )).toList(),
                        ),
                      ],
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
                    decoration: BoxDecoration(
                      color: AppTheme.background,
                      borderRadius: const BorderRadius.vertical(bottom: Radius.circular(20)),
                      border: Border(top: BorderSide(color: AppTheme.borderLight)),
                    ),
                    child: Row(
                      children: [
                        Expanded(
                          child: GestureDetector(
                            onTap: () => showBookCounsellingSheet(context),
                            child: const Text('Get Free Advice →',
                                style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: AppTheme.gold)),
                          ),
                        ),
                        ElevatedButton(
                          onPressed: () => _toggleCart(i),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: inCart ? AppTheme.darkBrown : AppTheme.gold,
                            foregroundColor: inCart ? Colors.white : AppTheme.darkBrown,
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                          ),
                          child: Text(inCart ? '✓ Added' : 'Add to Cart',
                              style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w800)),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ).animate().fadeIn(delay: Duration(milliseconds: i * 80)).slideY(begin: 0.1);
          }),
        ],
      ),
    );
  }
}
