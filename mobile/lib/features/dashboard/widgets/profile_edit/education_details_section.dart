import 'package:flutter/material.dart';
import '../../../../core/theme.dart';

class EducationDetailsSection extends StatelessWidget {
  final Map<String, dynamic> userData;
  final Function(String section, Map<String, dynamic>? item) onAddItem;

  const EducationDetailsSection({
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
        _sectionTitle('EDUCATION HISTORY'),
        const SizedBox(height: 16),
        Text('Tap any record to modify it.', style: TextStyle(fontSize: 9, color: AppTheme.textMuted, fontStyle: FontStyle.italic)),
        const SizedBox(height: 24),
        
        // High School Card
        _EducationCard(
          icon: Icons.school_outlined,
          title: 'HIGH SCHOOL',
          items: profile['highSchool'] ?? [],
          onAdd: () => onAddItem('highSchool', null),
          onEdit: (item) => onAddItem('highSchool', item),
          nameLabel: 'SCHOOL NAME',
          nameKey: 'schoolName',
        ),
        
        const SizedBox(height: 24),
        
        // Bachelor's Card
        _EducationCard(
          icon: Icons.workspace_premium_outlined,
          title: 'BACHELOR\'S DEGREE',
          items: profile['underGrad'] ?? [],
          onAdd: () => onAddItem('underGrad', null),
          onEdit: (item) => onAddItem('underGrad', item),
          nameLabel: 'UNIVERSITY NAME',
          nameKey: 'uniName',
        ),
        
        const SizedBox(height: 24),
        
        // Master's Card
        _EducationCard(
          icon: Icons.history_edu_outlined,
          title: 'MASTER\'S DEGREE',
          items: profile['masters'] ?? [],
          onAdd: () => onAddItem('masters', null),
          onEdit: (item) => onAddItem('masters', item),
          nameLabel: 'UNIVERSITY NAME',
          nameKey: 'uniName',
        ),
      ],
    );
  }

  Widget _sectionTitle(String title) {
    return Text(
      title,
      style: const TextStyle(
        fontSize: 16,
        fontWeight: FontWeight.w900,
        fontStyle: FontStyle.italic,
        fontFamily: 'Playfair Display',
        letterSpacing: 1.5,
        color: AppTheme.textPrimary,
      ),
    );
  }
}

class _EducationCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final List items;
  final VoidCallback onAdd;
  final Function(Map<String, dynamic> item) onEdit;
  final String nameLabel;
  final String nameKey;

  const _EducationCard({
    required this.icon,
    required this.title,
    required this.items,
    required this.onAdd,
    required this.onEdit,
    required this.nameLabel,
    required this.nameKey,
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
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.02),
            blurRadius: 20,
            offset: const Offset(0, 8),
          )
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: AppTheme.background,
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Icon(icon, color: AppTheme.gold, size: 18),
              ),
              const SizedBox(width: 16),
              Text(
                title,
                style: const TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.w900,
                  letterSpacing: 1.5,
                  color: AppTheme.textPrimary,
                ),
              ),
              const Spacer(),
              IconButton(onPressed: onAdd, icon: const Icon(Icons.add_circle_outline, color: Colors.green, size: 20)),
            ],
          ),
          
          if (items.isNotEmpty) ...[
            const SizedBox(height: 24),
            ...items.map((item) => GestureDetector(
              onTap: () => onEdit(Map<String, dynamic>.from(item)),
              child: Container(
                color: Colors.transparent, // Fixes gesture detection area
                child: Column(
                  children: [
                    Row(
                      children: [
                        Expanded(
                          flex: 2,
                          child: _infoColumn(nameLabel, item[nameKey] ?? ''),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          flex: 1,
                          child: _infoColumn('RESULT', '${item['cgpa']} / ${item['outOf']}'),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                  ],
                ),
              ),
            )).toList(),
          ],
        ],
      ),
    );
  }

  Widget _infoColumn(String label, String value) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(
            fontSize: 8,
            fontWeight: FontWeight.w900,
            color: AppTheme.textSecondary,
            letterSpacing: 1.5,
          ),
        ),
        const SizedBox(height: 6),
        Container(
          width: double.infinity,
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          decoration: BoxDecoration(
            color: AppTheme.background,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: AppTheme.borderLight.withOpacity(0.5)),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                value,
                style: const TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  color: AppTheme.textPrimary,
                ),
              ),
              const Icon(Icons.edit, size: 10, color: AppTheme.gold),
            ],
          ),
        ),
      ],
    );
  }
}
