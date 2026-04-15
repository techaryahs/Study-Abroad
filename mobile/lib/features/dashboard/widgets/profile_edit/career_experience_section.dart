import 'package:flutter/material.dart';
import '../../../../core/theme.dart';

class CareerExperienceSection extends StatelessWidget {
  final Map<String, dynamic> userData;
  final Function(String section, Map<String, dynamic>? existingItem) onAddItem;

  const CareerExperienceSection({
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
            const Text('CAREER & IMPACT', 
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900, fontStyle: FontStyle.italic, fontFamily: 'Playfair Display', letterSpacing: 1.5)),
            const Icon(Icons.business_center_outlined, color: AppTheme.gold, size: 20),
          ],
        ),
        const SizedBox(height: 8),
        Text('Tap any entry to modify details.', style: TextStyle(fontSize: 9, color: AppTheme.textMuted, fontStyle: FontStyle.italic)),
        const SizedBox(height: 24),
        
        // Work Experience
        _SectionCard(
          title: 'WORK EXPERIENCE',
          icon: Icons.work_outline,
          items: profile['workExperience'] ?? [],
          onAdd: () => onAddItem('workExperience', null),
          onEdit: (it) => onAddItem('workExperience', it),
          displayBuilder: (it) => Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(it['role']?.toString().toUpperCase() ?? 'ROLE', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w900)),
                  const Icon(Icons.edit, size: 12, color: AppTheme.gold),
                ],
              ),
              Text(it['organization'] ?? 'Company', style: const TextStyle(fontSize: 10, color: AppTheme.textSecondary, fontWeight: FontWeight.w700)),
              if (it['description'] != null) ...[
                const SizedBox(height: 8),
                Text(it['description'], style: const TextStyle(fontSize: 9, color: AppTheme.textMuted, height: 1.4)),
              ],
            ],
          ),
        ),
        
        const SizedBox(height: 24),
        
        // Volunteering
        _SectionCard(
          title: 'VOLUNTEERING',
          icon: Icons.volunteer_activism_outlined,
          items: profile['volunteering'] ?? [],
          onAdd: () => onAddItem('volunteering', null),
          onEdit: (it) => onAddItem('volunteering', it),
          displayBuilder: (it) => Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(it['role']?.toString().toUpperCase() ?? 'VOLUNTEER', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w900)),
                  const Icon(Icons.edit, size: 12, color: AppTheme.gold),
                ],
              ),
              Text(it['organization'] ?? 'Org', style: const TextStyle(fontSize: 10, color: AppTheme.textSecondary, fontWeight: FontWeight.w700)),
              if (it['cause'] != null)
                Text('Cause: ${it['cause']}', style: const TextStyle(fontSize: 9, color: AppTheme.gold, fontWeight: FontWeight.w600)),
            ],
          ),
        ),
      ],
    );
  }
}

class _SectionCard extends StatelessWidget {
  final String title;
  final IconData icon;
  final List items;
  final VoidCallback onAdd;
  final Function(Map<String, dynamic> item) onEdit;
  final Widget Function(dynamic item) displayBuilder;

  const _SectionCard({
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
              Text(title, style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w900, letterSpacing: 1.5)),
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
          ] else
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 20),
              child: Center(
                child: Text('NO RECORDS ADDED', style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: AppTheme.textMuted.withOpacity(0.5), letterSpacing: 1.5)),
              ),
            ),
        ],
      ),
    );
  }
}
