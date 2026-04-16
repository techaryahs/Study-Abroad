import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme.dart';

class PopularProgramsScreen extends StatelessWidget {
  const PopularProgramsScreen({super.key});

  static final List<Map<String, dynamic>> _programs = [
    {
      'title': 'Computer Science & Engineering',
      'icon': Icons.computer_rounded,
      'description': 'Explore top universities for CS and software development.',
    },
    {
      'title': 'Business & Management',
      'icon': Icons.business_rounded,
      'description': 'Leading MBA and business programs worldwide.',
    },
    {
      'title': 'Data Science & AI',
      'icon': Icons.analytics_rounded,
      'description': 'Specialized programs in AI, ML, and data science.',
    },
    {
      'title': 'Engineering',
      'icon': Icons.build_circle_rounded,
      'description': 'Top-tier engineering universities globally.',
    },
    {
      'title': 'Medicine & Healthcare',
      'icon': Icons.local_hospital_rounded,
      'description': 'Premier medical and healthcare programs.',
    },
    {
      'title': 'Finance & Economics',
      'icon': Icons.trending_up_rounded,
      'description': 'Best universities for finance and economics.',
    },
    {
      'title': 'Law',
      'icon': Icons.gavel_rounded,
      'description': 'Top law schools and legal education institutions.',
    },
    {
      'title': 'Psychology & Social Sciences',
      'icon': Icons.psychology_rounded,
      'description': 'Leading programs in psychology and social studies.',
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        backgroundColor: AppTheme.background,
        elevation: 0,
        title: const Text('Popular Programs', style: TextStyle(color: AppTheme.textPrimary, fontWeight: FontWeight.w900, fontSize: 20)),
        iconTheme: const IconThemeData(color: AppTheme.textPrimary),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Explore the most sought-after academic programs worldwide.',
                style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: AppTheme.textSecondary, height: 1.6),
              ),
              const SizedBox(height: 20),
              Expanded(
                child: GridView.builder(
                  physics: const BouncingScrollPhysics(),
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    crossAxisSpacing: 14,
                    mainAxisSpacing: 14,
                    childAspectRatio: 0.85,
                  ),
                  itemCount: _programs.length,
                  itemBuilder: (context, index) {
                    final program = _programs[index];
                    return _programCard(program);
                  },
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _programCard(Map<String, dynamic> program) {
    return Container(
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
      child: Material(
        color: Colors.transparent,
        borderRadius: BorderRadius.circular(20),
        child: InkWell(
          borderRadius: BorderRadius.circular(20),
          onTap: () {},
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  width: 50,
                  height: 50,
                  decoration: BoxDecoration(
                    color: AppTheme.gold.withOpacity(0.12),
                    borderRadius: BorderRadius.circular(14),
                  ),
                  child: Icon(program['icon'] as IconData, color: AppTheme.gold, size: 26),
                ),
                const SizedBox(height: 14),
                Text(
                  program['title'] as String,
                  style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w900, color: AppTheme.textPrimary, height: 1.3),
                  maxLines: 2,
                ),
                const SizedBox(height: 8),
                Text(
                  program['description'] as String,
                  style: const TextStyle(fontSize: 11, color: AppTheme.textSecondary, height: 1.4),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                const Spacer(),
                Row(
                  children: const [
                    Icon(Icons.arrow_forward_ios_rounded, size: 12, color: AppTheme.textSecondary),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
