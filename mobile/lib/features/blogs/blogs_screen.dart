import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../core/theme.dart';

class BlogsScreen extends StatelessWidget {
  const BlogsScreen({super.key});

  final List<Map<String, String>> _blogs = const [
    {'title': 'How to Get Into MIT: A Complete Guide', 'category': 'Admissions', 'readTime': '8 min read', 'date': 'Apr 10, 2026', 'emoji': '🎓'},
    {'title': 'GRE vs GMAT: Which Should You Take?', 'category': 'Test Prep', 'readTime': '5 min read', 'date': 'Apr 7, 2026', 'emoji': '📝'},
    {'title': 'Top 10 Scholarships for Indian Students in USA', 'category': 'Scholarships', 'readTime': '6 min read', 'date': 'Apr 3, 2026', 'emoji': '💰'},
    {'title': 'F1 Visa Interview: Questions & Tips 2026', 'category': 'Visa', 'readTime': '7 min read', 'date': 'Mar 30, 2026', 'emoji': '🛂'},
    {'title': 'Writing a Winning Statement of Purpose', 'category': 'SOP', 'readTime': '10 min read', 'date': 'Mar 25, 2026', 'emoji': '✍️'},
    {'title': 'Study in Germany: Free Education Guide', 'category': 'Germany', 'readTime': '6 min read', 'date': 'Mar 20, 2026', 'emoji': '🇩🇪'},
  ];

  final List<String> _categories = const ['All', 'Admissions', 'Scholarships', 'Visa', 'Test Prep', 'SOP'];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        title: const Text('Blogs & Articles'),
        backgroundColor: AppTheme.background,
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Featured
          Container(
            height: 180,
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [AppTheme.darkBrown, Color(0xFF2D2015)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(24),
            ),
            padding: const EdgeInsets.all(24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: AppTheme.gold.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: AppTheme.gold.withOpacity(0.3)),
                  ),
                  child: const Text('✦ FEATURED', style: TextStyle(color: AppTheme.gold, fontSize: 14, fontWeight: FontWeight.w800, letterSpacing: 2)),
                ),
                const SizedBox(height: 12),
                const Text('How to Get Into MIT:\nA Complete 2026 Guide',
                    style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.w900, height: 1.2)),
                const Spacer(),
                Row(children: [
                  Text('Apr 10, 2026', style: TextStyle(color: Colors.white.withOpacity(0.5), fontSize: 13)),
                  const Spacer(),
                  const Text('8 min read', style: TextStyle(color: AppTheme.gold, fontSize: 13, fontWeight: FontWeight.w700)),
                ]),
              ],
            ),
          ).animate().fadeIn(duration: 400.ms),

          const SizedBox(height: 20),

          // Category chips
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: _categories.map((c) => Container(
                margin: const EdgeInsets.only(right: 8),
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                decoration: BoxDecoration(
                  color: c == 'All' ? AppTheme.darkBrown : Colors.white,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: c == 'All' ? AppTheme.darkBrown : AppTheme.borderLight),
                ),
                child: Text(c, style: TextStyle(
                  fontSize: 13, fontWeight: FontWeight.w700,
                  color: c == 'All' ? Colors.white : AppTheme.textSecondary,
                )),
              )).toList(),
            ),
          ),

          const SizedBox(height: 20),

          // Blog list
          ...List.generate(_blogs.length, (i) {
            final b = _blogs[i];
            return Container(
              margin: const EdgeInsets.only(bottom: 12),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(18),
                border: Border.all(color: AppTheme.borderLight),
              ),
              child: Row(
                children: [
                  Container(
                    width: 60, height: 60,
                    decoration: BoxDecoration(
                      color: AppTheme.darkBrown.withOpacity(0.08),
                      borderRadius: BorderRadius.circular(14),
                    ),
                    child: Center(child: Text(b['emoji']!, style: const TextStyle(fontSize: 28))),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                            color: AppTheme.gold.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text(b['category']!,
                              style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: AppTheme.gold, letterSpacing: 0.5)),
                        ),
                        const SizedBox(height: 6),
                        Text(b['title']!,
                            style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: AppTheme.textPrimary, height: 1.3)),
                        const SizedBox(height: 6),
                        Row(children: [
                          Text(b['date']!, style: const TextStyle(fontSize: 14, color: AppTheme.textSecondary)),
                          const Text(' · ', style: TextStyle(color: AppTheme.textSecondary)),
                          Text(b['readTime']!, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: AppTheme.gold)),
                        ]),
                      ],
                    ),
                  ),
                  const Icon(Icons.arrow_forward_ios_rounded, size: 12, color: AppTheme.textSecondary),
                ],
              ),
            ).animate().fadeIn(delay: Duration(milliseconds: i * 60));
          }),
        ],
      ),
    );
  }
}
