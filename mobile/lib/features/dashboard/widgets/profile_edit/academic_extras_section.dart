import 'package:flutter/material.dart';
import '../../../../core/theme.dart';

class AcademicExtrasSection extends StatelessWidget {
  final Map<String, dynamic> userData;
  final Function(String section, Map<String, dynamic>? item) onAddItem;

  const AcademicExtrasSection({
    super.key,
    required this.userData,
    required this.onAddItem,
  });

  @override
  Widget build(BuildContext context) {
    final profile = userData['profile'] ?? {};
    
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text('ACADEMIC PORTFOLIO', 
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900, fontStyle: FontStyle.italic, fontFamily: 'Playfair Display', letterSpacing: 1.5)),
            const Icon(Icons.rocket_launch_outlined, color: AppTheme.gold, size: 20),
          ],
        ),
        const SizedBox(height: 8),
        Text('Modify existing records by tapping on them.', style: TextStyle(fontSize: 14, color: AppTheme.textMuted, fontStyle: FontStyle.italic)),
        const SizedBox(height: 24),
        
        // Projects
        _PortfolioCard(
          title: 'PROJECTS',
          icon: Icons.code,
          items: profile['projects'] ?? [],
          onAdd: () => onAddItem('projects', null),
          onEdit: (it) => onAddItem('projects', it),
          displayBuilder: (it) => Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(it['title']?.toString().toUpperCase() ?? 'PROJECT', style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w900)),
                  const Icon(Icons.edit, size: 12, color: AppTheme.gold),
                ],
              ),
              Text(it['category'] ?? 'Tech', style: const TextStyle(fontSize: 14, color: AppTheme.gold, fontWeight: FontWeight.w700)),
            ],
          ),
        ),
        
        const SizedBox(height: 24),
        
        // Research
        _PortfolioCard(
          title: 'RESEARCH PUBS',
          icon: Icons.biotech,
          items: profile['research'] ?? [],
          onAdd: () => onAddItem('research', null),
          onEdit: (it) => onAddItem('research', it),
          displayBuilder: (it) => Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(it['title']?.toString().toUpperCase() ?? 'RESEARCH', style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w900)),
                  const Icon(Icons.edit, size: 12, color: AppTheme.gold),
                ],
              ),
              Text(it['publisher'] ?? 'Publisher', style: const TextStyle(fontSize: 14, color: AppTheme.textSecondary, fontWeight: FontWeight.w700)),
            ],
          ),
        ),

        const SizedBox(height: 24),
        
        // Test Scores
        _PortfolioCard(
          title: 'TEST SCORES',
          icon: Icons.analytics_outlined,
          items: profile['testScores'] ?? [],
          onAdd: () => onAddItem('testScores', null),
          onEdit: (it) => onAddItem('testScores', it),
          displayBuilder: (it) => Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(it['testType']?.toString().toUpperCase() ?? 'TEST', style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w900)),
                  const Icon(Icons.edit, size: 12, color: AppTheme.gold),
                ],
              ),
              Text('SCORE: ${it['score']}', style: const TextStyle(fontSize: 13, color: Colors.green, fontWeight: FontWeight.w900)),
            ],
          ),
        ),
      ],
    );
  }
}

class _PortfolioCard extends StatelessWidget {
  final String title;
  final IconData icon;
  final List items;
  final VoidCallback onAdd;
  final Function(Map<String, dynamic> item) onEdit;
  final Widget Function(dynamic item) displayBuilder;

  const _PortfolioCard({
    required this.title,
    required this.icon,
    required this.items,
    required this.onAdd,
    required this.onEdit,
    required this.displayBuilder,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(28),
        border: Border.all(color: AppTheme.borderLight),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, color: AppTheme.gold, size: 18),
              const SizedBox(width: 12),
              Text(title, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w900, letterSpacing: 1.5)),
              const Spacer(),
              IconButton(onPressed: onAdd, icon: const Icon(Icons.add_circle_outline, color: Colors.green, size: 20)),
            ],
          ),
          if (items.isNotEmpty) ...[
            const SizedBox(height: 16),
            ...items.map((it) => GestureDetector(
              onTap: () => onEdit(Map<String, dynamic>.from(it)),
              child: Container(
                margin: const EdgeInsets.only(bottom: 12),
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppTheme.background,
                  borderRadius: BorderRadius.circular(16),
                ),
                child: displayBuilder(it),
              ),
            )).toList(),
          ]
        ],
      ),
    );
  }
}
