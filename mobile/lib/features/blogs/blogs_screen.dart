import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../core/theme.dart';
import '../../widgets/book_counselling_sheet.dart';

class BlogsScreen extends StatefulWidget {
  const BlogsScreen({super.key});

  @override
  State<BlogsScreen> createState() => _BlogsScreenState();
}

class _BlogsScreenState extends State<BlogsScreen> {
  String _selectedCategory = 'All';

  final List<Map<String, String>> _blogs = const [
    {
      'title': 'How to Get Into MIT: A Complete Guide',
      'category': 'Admissions',
      'readTime': '8 min read',
      'date': 'Apr 10, 2026',
      'emoji': '🎓',
      'summary':
          'Comprehensive breakdown of the MIT application strategy: holistic evaluations, STEM research portfolio, stellar recommendation letters, and acing the interview.',
    },
    {
      'title': 'GRE vs GMAT: Which Should You Take?',
      'category': 'Test Prep',
      'readTime': '5 min read',
      'date': 'Apr 7, 2026',
      'emoji': '📝',
      'summary':
          'Key differences between GRE and GMAT: scoring scales, question formats, university preferences, and how to select the right test for your target program.',
    },
    {
      'title': 'Top 10 Scholarships for Indian Students in USA',
      'category': 'Scholarships',
      'readTime': '6 min read',
      'date': 'Apr 3, 2026',
      'emoji': '💰',
      'summary':
          'Explore fully-funded and partial scholarship programs in the United States, eligibility requirements, application deadlines, and essay tips.',
    },
    {
      'title': 'F1 Visa Interview: Questions & Tips 2026',
      'category': 'Visa',
      'readTime': '7 min read',
      'date': 'Mar 30, 2026',
      'emoji': '🛂',
      'summary':
          'Master your consular interview: proving non-immigrant intent, demonstrating financial backing, and answering tricky officer questions confidently.',
    },
    {
      'title': 'Writing a Winning Statement of Purpose',
      'category': 'SOP',
      'readTime': '10 min read',
      'date': 'Mar 25, 2026',
      'emoji': '✍️',
      'summary':
          'The structural blueprint for an Ivy League SOP: hook, academic pedigree, professional trajectory, university-specific faculty alignment, and future goals.',
    },
    {
      'title': 'Study in Germany: Free Education Guide',
      'category': 'Germany',
      'readTime': '6 min read',
      'date': 'Mar 20, 2026',
      'emoji': '🇩🇪',
      'summary':
          'Everything you need to know about zero-tuition public universities in Germany, blocked account requirements, APS certificates, and post-study work visas.',
    },
  ];

  final List<String> _categories = const [
    'All',
    'Admissions',
    'Scholarships',
    'Visa',
    'Test Prep',
    'SOP',
    'Germany'
  ];

  void _showBlogDetails(BuildContext context, Map<String, String> blog) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => Container(
        padding: const EdgeInsets.all(24),
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
        ),
        child: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(
                    color: AppTheme.borderLight,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              const SizedBox(height: 20),
              Row(
                children: [
                  Container(
                    width: 52,
                    height: 52,
                    decoration: BoxDecoration(
                      color: AppTheme.gold.withOpacity(0.12),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Center(
                      child: Text(blog['emoji'] ?? '📚',
                          style: const TextStyle(fontSize: 26)),
                    ),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                            color: AppTheme.gold.withOpacity(0.12),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text(
                            (blog['category'] ?? '').toUpperCase(),
                            style: const TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.w800,
                              color: AppTheme.gold,
                              letterSpacing: 0.8,
                            ),
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          '${blog['date']} · ${blog['readTime']}',
                          style: const TextStyle(
                              fontSize: 12, color: AppTheme.textSecondary),
                        ),
                      ],
                    ),
                  ),
                  IconButton(
                    onPressed: () => Navigator.pop(ctx),
                    icon: const Icon(Icons.close_rounded),
                  ),
                ],
              ),
              const SizedBox(height: 20),
              Text(
                blog['title'] ?? '',
                style: const TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.w900,
                  color: AppTheme.textPrimary,
                  height: 1.25,
                ),
              ),
              const SizedBox(height: 16),
              Text(
                blog['summary'] ??
                    'Detailed insights and guidelines to prepare your application for top universities.',
                style: const TextStyle(
                  fontSize: 14,
                  height: 1.6,
                  color: AppTheme.textSecondary,
                ),
              ),
              const SizedBox(height: 28),
              SizedBox(
                width: double.infinity,
                height: 50,
                child: ElevatedButton(
                  onPressed: () {
                    Navigator.pop(ctx);
                    showBookCounsellingSheet(context);
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.darkBrown,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(14)),
                  ),
                  child: const Text(
                    'DISCUSS WITH ADVISOR',
                    style: TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w800,
                        letterSpacing: 1),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final filteredBlogs = _selectedCategory == 'All'
        ? _blogs
        : _blogs.where((b) => b['category'] == _selectedCategory).toList();

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
          GestureDetector(
            onTap: () => _showBlogDetails(context, _blogs[0]),
            child: Container(
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
                    padding:
                        const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: AppTheme.gold.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(12),
                      border:
                          Border.all(color: AppTheme.gold.withOpacity(0.3)),
                    ),
                    child: const Text('✦ FEATURED',
                        style: TextStyle(
                            color: AppTheme.gold,
                            fontSize: 14,
                            fontWeight: FontWeight.w800,
                            letterSpacing: 2)),
                  ),
                  const SizedBox(height: 12),
                  const Text('How to Get Into MIT:\nA Complete 2026 Guide',
                      style: TextStyle(
                          color: Colors.white,
                          fontSize: 20,
                          fontWeight: FontWeight.w900,
                          height: 1.2)),
                  const Spacer(),
                  Row(children: [
                    Text('Apr 10, 2026',
                        style: TextStyle(
                            color: Colors.white.withOpacity(0.5),
                            fontSize: 13)),
                    const Spacer(),
                    const Text('8 min read',
                        style: TextStyle(
                            color: AppTheme.gold,
                            fontSize: 13,
                            fontWeight: FontWeight.w700)),
                  ]),
                ],
              ),
            ),
          ).animate().fadeIn(duration: 400.ms),

          const SizedBox(height: 20),

          // Category chips
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: _categories.map((c) {
                final isSelected = _selectedCategory == c;
                return GestureDetector(
                  onTap: () => setState(() => _selectedCategory = c),
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 200),
                    margin: const EdgeInsets.only(right: 8),
                    padding: const EdgeInsets.symmetric(
                        horizontal: 16, vertical: 8),
                    decoration: BoxDecoration(
                      color: isSelected ? AppTheme.darkBrown : Colors.white,
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(
                          color: isSelected
                              ? AppTheme.darkBrown
                              : AppTheme.borderLight),
                    ),
                    child: Text(
                      c,
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w700,
                        color: isSelected
                            ? Colors.white
                            : AppTheme.textSecondary,
                      ),
                    ),
                  ),
                );
              }).toList(),
            ),
          ),

          const SizedBox(height: 20),

          // Blog list
          if (filteredBlogs.isEmpty)
            Container(
              padding: const EdgeInsets.all(32),
              alignment: Alignment.center,
              child: const Text('No articles found in this category.',
                  style: TextStyle(color: AppTheme.textSecondary)),
            )
          else
            ...List.generate(filteredBlogs.length, (i) {
              final b = filteredBlogs[i];
              return InkWell(
                borderRadius: BorderRadius.circular(18),
                onTap: () => _showBlogDetails(context, b),
                child: Container(
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
                        width: 60,
                        height: 60,
                        decoration: BoxDecoration(
                          color: AppTheme.darkBrown.withOpacity(0.08),
                          borderRadius: BorderRadius.circular(14),
                        ),
                        child: Center(
                            child: Text(b['emoji']!,
                                style: const TextStyle(fontSize: 28))),
                      ),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 8, vertical: 3),
                              decoration: BoxDecoration(
                                color: AppTheme.gold.withOpacity(0.1),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Text(b['category']!,
                                  style: const TextStyle(
                                      fontSize: 12,
                                      fontWeight: FontWeight.w800,
                                      color: AppTheme.gold,
                                      letterSpacing: 0.5)),
                            ),
                            const SizedBox(height: 6),
                            Text(b['title']!,
                                style: const TextStyle(
                                    fontSize: 14,
                                    fontWeight: FontWeight.w700,
                                    color: AppTheme.textPrimary,
                                    height: 1.3)),
                            const SizedBox(height: 6),
                            Row(children: [
                              Text(b['date']!,
                                  style: const TextStyle(
                                      fontSize: 12,
                                      color: AppTheme.textSecondary)),
                              const Text(' · ',
                                  style: TextStyle(
                                      color: AppTheme.textSecondary)),
                              Text(b['readTime']!,
                                  style: const TextStyle(
                                      fontSize: 12,
                                      fontWeight: FontWeight.w700,
                                      color: AppTheme.gold)),
                            ]),
                          ],
                        ),
                      ),
                      const Icon(Icons.arrow_forward_ios_rounded,
                          size: 14, color: AppTheme.textSecondary),
                    ],
                  ),
                ),
              ).animate().fadeIn(delay: Duration(milliseconds: i * 60));
            }),
        ],
      ),
    );
  }
}
