import 'package:flutter/material.dart';
import '../../../../core/theme.dart';

class TargetStrategySection extends StatelessWidget {
  final Map<String, dynamic> userData;
  final Function(String section, Map<String, dynamic>? item) onAddItem;

  const TargetStrategySection({
    super.key,
    required this.userData,
    required this.onAddItem,
  });

  @override
  Widget build(BuildContext context) {
    final profile = userData['profile'] ?? {};
    final unis = profile['targetUniversities'] ?? [];
    
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text('UNIVERSITY STRATEGY', 
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900, fontStyle: FontStyle.italic, fontFamily: 'Playfair Display', letterSpacing: 1.5)),
            const Icon(Icons.map_outlined, color: AppTheme.gold, size: 20),
          ],
        ),
        const SizedBox(height: 8),
        Text('Tap any university to update your strategy.', style: TextStyle(fontSize: 9, color: AppTheme.textMuted, fontStyle: FontStyle.italic)),
        const SizedBox(height: 24),
        
        Container(
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
                  const Icon(Icons.apartment_rounded, color: AppTheme.gold, size: 18),
                  const SizedBox(width: 12),
                  const Text('TARGET UNIVERSITIES', style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, letterSpacing: 1.5)),
                  const Spacer(),
                  IconButton(onPressed: () => onAddItem('targetUniversities', null), icon: const Icon(Icons.add_circle_outline, color: Colors.green, size: 20)),
                ],
              ),
              if (unis.isNotEmpty) ...[
                const SizedBox(height: 20),
                ...unis.map((it) => GestureDetector(
                  onTap: () => onAddItem('targetUniversities', Map<String, dynamic>.from(it)),
                  child: Container(
                    margin: const EdgeInsets.only(bottom: 16),
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: AppTheme.background,
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(it['uniName']?.toString().toUpperCase() ?? 'UNIVERSITY', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w900)),
                            const Icon(Icons.edit, size: 12, color: AppTheme.gold),
                          ],
                        ),
                        const SizedBox(height: 4),
                        Text('${it['degree']} | ${it['major']}', style: const TextStyle(fontSize: 10, color: AppTheme.textSecondary, fontWeight: FontWeight.w700)),
                        const SizedBox(height: 4),
                        Text('INTAKE: ${it['term']} ${it['year']}', style: const TextStyle(fontSize: 9, color: AppTheme.gold, fontWeight: FontWeight.w900, letterSpacing: 1)),
                      ],
                    ),
                  ),
                )).toList(),
              ] else
                const Padding(
                  padding: EdgeInsets.symmetric(vertical: 40),
                  child: Center(child: Text('NO TARGETS DEFINED', style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: AppTheme.textMuted, letterSpacing: 2))),
                )
            ],
          ),
        ),
      ],
    );
  }
}
